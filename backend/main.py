## simbl-server
## 10/19/2024
## Written by userbyte
## Description: backend server for simbl
version = '0.3.0'
print(f'simbl-server v{version}')

from flask import Flask, jsonify, request, send_file
from flask_restful import Resource, Api
from flask_cors import CORS
import json, random, time, inspect, pickledb, os, requests, toml, logging
from datetime import datetime
from flask_compress import Compress
import modules.xclient as xclient_

logger = logging.getLogger(__name__)

# .-- Globals--.
global cfg
global xclient
# *-- Globals --*


# .-- Functions --.

def load_config():
    """Config loader"""

    global cfg
    global xclient

    # try to load da config
    try:
        with open('cfg/config.toml', 'r') as f:
            cfg = toml.load(f)
        xclient = xclient_.xClient(cfg['xapi_url'])
        admin_id = cfg['admin_id']
    except Exception as e:
        logger.error(f'simbl is in an unconfigured state.')
        # print('Prompting for config values...')
        # cfg = {
        #   "admin_id": input('Enter xAPI user ID of the admin user:'),
        # }
        # print(f'Saving config to {os.getcwd()}/cfg/config.toml...')
        logger.info('please navigate to the setup.html page on the frontend to complete setup.')
        # with open('cfg/config.toml', 'w') as f:
        #     toml.dump(cfg, f, encoder=None)
        #     print('Saved.')
        # print('Config loaded')
        return False
    except KeyError as e:
        logger.error(f'missing critical config entry: {e}')
    else:
        logger.info('config loaded')
        return cfg

def str_timestamp() -> str:
    """Return a sorta-pretty timestamp"""

    tstamp = str(datetime.now())
    return tstamp[:23]

def unix_timestamp() -> int:
    """Return a unix timestamp"""
    return int(datetime.now().timestamp())

def generate_post_id() -> str:
    """Return a unique post ID"""
    charset = '0123456789abcdef'
    return ''.join((random.choice(charset) for i in range(10)))

def initialize() -> None:
    """Initializes the simbl-server environment"""

    # do some initial environment setup

    # dirs
    # create data folder if not exist
    if not os.path.exists('data'):
        os.mkdir('data')
    # create logs folder if not exist
    if not os.path.exists('logs'):
        os.mkdir('logs')

    # configure logging
    logging.basicConfig(
        filename='logs/simbl-server.log',
        format='%(asctime)s.%(msecs)03d %(levelname)s %(module)s - %(funcName)s: %(message)s',
        level=logging.INFO)

    # initialize db
    global db
    db = pickledb.load('data/db.json', False)
    if not db.exists('posts'):
        db.lcreate('posts')
    db.dump()

    # create cfg folder if not exist
    if not os.path.exists('cfg'):
        os.mkdir('cfg')

def is_configured() -> bool | dict:
    # checks if simbl-server has run setup already

    # does the config directory exist?
    if not os.path.exists('cfg'):
        return False

    # does the config file exist?
    if not os.path.exists('cfg/config.toml'):
        return False

    # what does load_config() return?
    # if its false, we're not configured properly
    if load_config() == False:
        return False
    else:
        return cfg['configured']

def is_user_admin(token:str = False) -> bool:
    """Checks if a user is the admin of this simbl instance"""

    if not token:
        # no token was passed, admin status cannot be checked
        return False

    # authenticate with xapi
    x,y = xclient.authenticate(token)
    if x:
        # check if the user id is the same as the configured admin id of this simbl instance
        if y['id'] == cfg['admin_id']:
            return True
    else:
        return False

def get_posts(post_id:str = None) -> dict:
    """Get a specific post by it's ID"""
    posts = db.get('posts')
    try:
        post = posts[post_id]
    except KeyError:
        logger.error(f'get_posts(): key "{post_id}" does not exist in database')
        return {}
    else:
        return post

def get_posts() -> list[dict]:
    """Get all posts from the database"""
    posts = db.get('posts')
    return posts

def save_post(post:dict = None) -> bool:
    """Save a post to the database"""

    if post == None:
        return False

    # validate post
    try:
        post['id']
        post['timestamp']
        post['author']
        post['text']
        #post['attachments'] # TODO
    except KeyError as e:
        logger.error(f'save_post(): post is invalid | {e} ({post})')
        return False

    try:
        db.ladd('posts', post)
        db.dump()
        logger.info(f'post saved ({post})')
        return True
    except Exception as e:
        logger.error(f'save_post(): error adding to db | {e} ({post})')
        return False


def edit_post(post_id:str = None, edited_post:dict = None):
    # TODO
    return 'NOT_IMPLEMENTED'

    # edits a post
    if post_id == None or edited_post == None:
        return False

def delete_post():
    # TODO
    return 'NOT_IMPLEMENTED'
    # deletes a post

# *-- Functions --*


# .-- API resource classes --.

class noRouteResource(Resource):
    """Resource for getting API information. Mainly used as a test to see if the API is up."""
    def get(self):
        return {'info':f'simbl-server version {version}', 'version':f'{version}'}, 200
    def post(self):
        return {'info':f'simbl-server version {version}', 'version':f'{version}'}, 200

class setupResource(Resource):
    """Resource for initial setup of simbl"""
    def post(self):
        # are we setup already?
        if is_configured():
            # ok, we're already configured, client can go fuck themselves
            return {'status': 'failed', 'error':'Already configured'}, 409

        recvData = request.get_json()
        try:
            xapi_url = recvData['xapi_url']
            xapi_token = recvData['xapi_token']
        except Exception as e:
            return {'status': 'failed', 'error':'Your request is missing required JSON data'}, 400
        else:
            x,y = xclient_.xClient(xapi_url).authenticate(xapi_token)
            if x == 1:
                logger.info('configuring...')
                cfg = {
                  "configured": True,
                  "xapi_url": xapi_url,
                  "admin_id": y['id'],
                }
                logger.info(f'saving config to {os.getcwd()}/cfg/config.toml...')
                logger.info('please navigate to the setup.html page on the frontend to complete setup.')
                with open('cfg/config.toml', 'w') as f:
                    toml.dump(cfg, f, encoder=None)
                    logger.info('saved.')
                logger.info('config loaded')
                logger.info('setup complete!')
                return {'status':'success'}, 200
            elif x == 'error':
                return {'status': 'failed', 'error':'xAPI authentication failed. See simbl-server output for more details.'}, 400

class postsResource(Resource):
    """Resource for getting and creating posts"""
    def get(self):
        """Get all posts"""
        # GET /posts

        if is_configured() == False:
            return {'status': 'failed', 'error':'simbl-server is not configured'}, 503

        posts = get_posts()
        return {'status':'success', 'posts': posts}, 200

    def post(self):
        """Post a post"""
        # POST /posts

        if is_configured() == False:
            return {'status': 'failed', 'error':'simbl-server is not configured'}, 503

        recvData = request.get_json()
        try:
            tk = request.headers['Token']
            post_content = recvData['post_content']
        except Exception as e:
            return {'status': 'failed', 'error':'Your request is missing required JSON data'}, 400
        else:
            x,y = xclient.authenticate(tk)
            if x == 1:
                # check if this is the admin of this simbl instance
                if not is_user_admin(tk):
                    return {'status': 'failed', 'error':'ur account is not the admin of this simbl instance'}, 403

                # format post into a dict for the db
                post = {
                            "id": generate_post_id(),

                            "timestamp": unix_timestamp(),

                            "author": y['id'],

                            "text": post_content, # "text": post_content['text'] # when other content types are added maybe

                            # "attachments": 
                            # [
                            #     {
                            #         "type":"image",
                            #         "data":"(base64-encoded image data)"
                            #     },
                            #     {
                            #         "type":"file",
                            #         "data":"(base64-encoded file data)"
                            #     },
                            # ]
                }

                # save the post to db
                a = save_post(post)
                if a == 1:
                    return {'status': 'success', 'post': post}, 200
                elif a == False:
                    logger.error('yeahr')
                    return {'status': 'failed', 'error': 'idk'}, 500
            else:
                return {'status': 'failed', 'error':'idk'}, 500

class adminResource(Resource):
    # TODO
    """Resource for admin"""
    def get(self):
        """Check if you are the admin of this simbl instance"""
        # GET /admin

        # check if no token was provided
        try: request.headers['Token']
        except KeyError:
            # if there was none, then no. you are not the admin.
            return {'status':'failed'}, 403

        if is_user_admin(request.headers['Token']):
            # provided token is associated with the admin account of this simbl instance
            return {'status':'success'}, 200
        else:
            # provided token is NOT associated with the admin account of this simbl instance
            return {'status':'failed'}, 403

# *-- API resource classes --*


app = Flask(__name__)
api = Api(app)
CORS(app)
Compress(app)

api.add_resource(noRouteResource, '/')
api.add_resource(setupResource, '/setup')
api.add_resource(postsResource, '/posts')
api.add_resource(adminResource, '/admin')

initialize()
load_config()

if __name__ == '__main__':
    app.run(debug=True)
