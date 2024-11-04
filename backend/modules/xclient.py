## xClient
## 8/24/2020
## Written by userbyte
## Description: API client library to interface with xAPI

import requests, json

version = '0.1.13.2'
#try:
#    origin = requests.get('https://api.ipify.org').text
#except Exception as e:
#    print('[xClient] Failed to set origin as IP')
#    origin = f'xClient.py {version}'
origin = f'xclient-{version}'
class xClient():
    def __init__(self, apiURL):
        if apiURL.endswith('/'):
            self.apiURL = apiURL
        else:
            self.apiURL = apiURL+'/'
        print(f'[xClient] xClient initiated with apiURL {self.apiURL}')

    def login(self, email:str = None, passwd:str = None):
        #print('[xClient] Login start')
        if email == None:
            return 'noEmail'
        if passwd == None:
            return 'noPassword'
        try: ## Attempt login
            print(f'[xClient] Logging into account "{email}" with password "{len(passwd)*"*"}"')
            url = self.apiURL+'login'
            headers = {'Content-Type': 'application/json', 'User-Agent': 'xClient', 'origin':origin}
            session = {"email":email,"password":passwd}
            body = json.dumps(session)
            try:
                req = requests.post(url, headers=headers, data=body)
                #print(f'[xClient] API response: {req.text}')
            except Exception as e:
                print(f'[xClient] xAPI may be offline or another error has occurred')
                return 'error', e
            else:
                if req.status_code == 202:
                    print('[xClient] Login successful')
                    recvData = json.loads(req.text)
                    uname = recvData['username']
                    tk = recvData['token']
                    return 1, {"token":tk, "email":email, "username":uname}
                elif req.status_code == 400:
                    print('[xClient] Required data was missing from your request')
                    return 0, 'Required data was missing from your request'
                elif req.status_code == 401:
                    print('[xClient] The password entered was incorrect')
                    return 0, 'The password entered was incorrect'
                elif req.status_code == 404:
                    print('[xClient] An account with that email does not exist')
                    return 0, 'An account with that email does not exist'
                elif req.status_code == 500:
                    print('[xClient] The API encountered an error while processing your request')
                    return 0, 'The API encountered an error while processing your request'
                else:
                    return 'error', 'Unknown error'
        except Exception as e:
            print(f'[xClient] An unknown error has occurred: {e}')
            return 'error', e
        else:
            print('Login request sent')

    def authenticate(self, token:str = None):
        if token == None:
            print('[xClient] Missing token')
            return 'error', 'noToken'
        headers = {'Token': token, 'origin':origin}
        try:
            req = requests.get(self.apiURL+'user/info', headers=headers)
        except Exception as e:
            print(f'[xClient] xAPI may be offline or another error has occurred. Error: {e}')
            return 'error', 0
        else:
            data = json.loads(req.text)
            if req.status_code == 200:
                print('[xClient] Successfully authenticated')
                uid = data['id']
                u = data['username']
                e = data['email']
                f = data['friends']
                p = data['permission']
                b = data['balance']
                return 1, {"id":uid, "username":u, "email":e, "friends":f, "permission":p, "balance":b}
            elif req.status_code == 405:
                print('[xClient] Unknown user action... the API route may of changed or you need to get the latest version of xDesktop and xClient')
                return 'error', 'Unknown action'
            elif req.status_code == 401:
                print('[xClient] The token sent with the request was invalid. Please check your token or re-login.')
                return 'error', 'Token invalid'
            else:
                return 'error', 'Unknown error'

    def createaccount(self, email:str = None, uname:str = None, pw:str = None):
        print('[xClient] Create account start')
        if email == None:
            return 'error', 'You must input a email. Ex. xclient.createaccount(email,username,password)'
        if uname == None:
            return 'error', 'You must input a username. Ex. xclient.createaccount(email,username,password)'
        if pw == None:
            return 'error', 'You must input a password. Ex. xclient.createaccount(email,username,password)'
        x,y = login(email, pw)
        if x == 1:
            return 'error', 'Account already exists'
        try: ## Attempt creating account
            print(f'[xClient] Creating account "{email}" ({uname}) with password "{len(pw)*"*"}"')
            url = self.apiURL+'createaccount'
            headers = {'Content-Type': 'application/json', 'User-Agent': 'xClient', 'origin':origin}
            session = {"email":email,"username":uname,"password":pw}
            body = json.dumps(session)
            try:
                req = requests.post(url, headers=headers, data=body)
                print(f'[xClient] API response: {req.text}')
            except Exception as e:
                print(f'[xClient] xAPI may be offline or another error has occurred. Error: {e}')
                return 'error', f'xAPI error: {e}'
            else:
                if req.status_code == 202:
                    print('[xClient] Created account successfully')
                    recvData = json.loads(req.text)
                    uid = recvData['id']
                    uname = recvData['username']
                    tk = recvData['token']
                    return 1, {"id":uid, "token":tk, "email":email, "username":uname}
                elif req.status_code == 400:
                    print('[xClient] Required data was missing from your request')
                    return 'error', 'Required data was missing from your request'
                elif req.status_code == 409:
                    print('[xClient] An account with that email already exists')
                    return 'error', 'An account already exists under that email'
                elif req.status_code == 422:
                    recvData = json.loads(req.text)
                    err = recvData['error']
                    print(f'[xClient] {err}')
                    return 'error', f'{err}'
                elif req.status_code == 411:
                    recvData = json.loads(req.text)
                    err = recvData['error']
                    print(f'[xClient] {err}')
                    return 'error', f'{err}'
                elif req.status_code == 500:
                    print('[xClient] The API encountered an error while processing your request')
                    return 'error', 0
                else:
                    print('[xClient] An unknown error has occurred')
                    return 'error', 'Unknown error'
        except Exception as e:
            print(f'xClient error')
            return 0, e
        else:
            recvData = json.loads(req.text)
            uname = recvData['username']
            tk = recvData['token']
            print("[xClient] Account creation completed")
            return 1, {"token":tk, "email":email, "username":uname}

    def deleteaccount(self, token):
        headers = {'Token': token, 'origin':origin}
        try:
            req = requests.get(self.apiURL+'user/deleteaccount', headers=headers)
        except Exception as e:
            print(f'[xClient] xAPI may be offline or another error has occurred. Error: {e}')
            return 'error', f'xAPI error: {e}'
        else:
            data = json.loads(req.text)
            if req.status_code == 200:
                print('[xClient] Successfully deleted user account')
                return 1, {"status":"Successfully deleted user account"}
            elif req.status_code == 404:
                print('[xClient] The token sent with the request does not have an account associated with it, how did this even happen?')
                return 'error', 'User does not exist'
            elif req.status_code == 405:
                print('[xClient] Unknown user action... the API route may of changed or you need to get the latest version of xDesktop and xClient')
                return 'error', 'Unknown action'
            elif req.status_code == 401:
                print('[xClient] The token sent with the request was invalid. Please check your token or re-login.')
                return 'error', 'Token invalid'   
            else:
                print('[xClient] An unknown error has occurred')
                return 'error', 'Unknown error'

    def userinfo(self, token):
        headers = {'Token': token, 'origin':origin}
        try:
            req = requests.get(self.apiURL+'user/info', headers=headers)
        except Exception as e:
            print(f'[xClient] xAPI may be offline or another error has occurred. Error: {e}')
            return 'error', 0
        else:
            data = json.loads(req.text)
            if req.status_code == 200:
                print('[xClient] Successfully got user information')
                uid = data['id']
                u = data['username']
                e = data['email']
                f = data['friends']
                p = data['permission']
                b = data['balance']
                return 1, {"id":uid, "username":u, "email":e, "friends":f, "permission":p, "balance":b}
            elif req.status_code == 405:
                print('[xClient] Unknown user action... the API route may of changed or you need to get the latest version of xDesktop and xClient')
                return 'error', 'Unknown action'
            elif req.status_code == 401:
                print('[xClient] The token sent with the request was invalid. Please check your token or re-login.')
                return 'error', 'Token invalid'
            else:
                return 'error', 'Unknown error'

    def getbalance(self, token:str = None):
        headers = {'Token': token, 'origin':origin}
        try:
            req = requests.get(self.apiURL+'user/balance', headers=headers)
        except Exception as e:
            print(f'[xClient] xAPI may be offline or another error has occurred. Error: {e}')
            return 'error', 0
        else:
            data = json.loads(req.text)
            if req.status_code == 200:
                print('[xClient] Successfully got user balance')
                b = data['balance']
                return 1, b
            elif req.status_code == 405:
                print('[xClient] Unknown user action... the API route may of changed or you need to get the latest version of xDesktop and xClient')
                return 'error', 'Unknown action'
            elif req.status_code == 401:
                print('[xClient] The token sent with the request was invalid. Please check your token or re-login.')
                return 'error', 'Token invalid'
            elif req.status_code == 400:
                print('[xClient] The token sent with the request was invalid. Please check your token or re-login.')
                return 'error', 'Token invalid'
            else:
                return 'error', 'Unknown error'

    def changepassword(self, token:str = None, newpass:str = None):
        headers = {'Token': token, 'origin':origin}
        try:
            req = requests.get(self.apiURL+f'user/changepassword?newpassword={newpass}', headers=headers)
        except Exception as e:
            print(f'[xClient] xAPI may be offline or another error has occurred. Error: {e}')
            return 'error', 0
        else:
            data = json.loads(req.text)
            if req.status_code == 200:
                print('[xClient] Successfully changed user password')
                s = data['status']
                return 1, {"status":s}
            elif req.status_code == 401:
                print('[xClient] The token sent with the request was invalid. Please check your token or re-login.')
                return 'error', 'Token invalid'
            else:
                return 'error', 'Unknown error'

    def redeemkey(self, token:str = None, key:str = None):
        headers = {'Token': token, 'origin':origin}
        try:
            req = requests.get(self.apiURL+f'user/redeemkey?key={key}', headers=headers)
        except Exception as e:
            print(f'[xClient] xAPI may be offline or another error has occurred. Error: {e}')
            return 'error', 0
        else:
            data = json.loads(req.text)
            if req.status_code == 200:
                print('[xClient] Successfully redeemed key')
                s = data['status']
                return 1, {"status":s}
            elif req.status_code == 401:
                print('[xClient] The token sent with the request was invalid. Please check your token or re-login.')
                return 'error', 'Token invalid'
            else:
                return 'error', 'Unknown error'

    def adminchangepassword(self, token, uid, newpass):
        headers = {'Token': token, 'origin':origin}
        try:
            req = requests.get(self.apiURL+f'admin/changepassword/{uid}?newpassword={newpass}', headers=headers)
        except Exception as e:
            print(f'[xClient] xAPI may be offline or another error has occurred. Error: {e}')
            return 'error', 0
        else:
            data = json.loads(req.text)
            if req.status_code == 200:
                print(f"[xClient] Successfully changed user[{uid}]'s password")
                s = data['status']
                return 1, {"status":s}
            elif req.status_code == 401:
                print('[xClient] The token sent with the request was invalid. Please check your token or re-login.')
                return 'error', 'Token invalid'
            elif req.status_code == 404:
                print('[xClient] The target email does not have an account associated with it')
                return 'error', 'User does not exist'
            else:
                return 'error', 'Unknown error'

    def admindeleteaccount(self, token, uid):
        headers = {'Token': token, 'origin':origin}
        try:
            req = requests.get(self.apiURL+f'admin/deleteaccount/{uid}', headers=headers)
        except Exception as e:
            print(f'[xClient] xAPI may be offline or another error has occurred. Error: {e}')
            return 'error', 0
        else:
            data = json.loads(req.text)
            if req.status_code == 200:
                print('[xClient] Successfully changed user password')
                s = data['status']
                return 1, {"status":s}
            elif req.status_code == 401:
                print('[xClient] The token sent with the request was invalid. Please check your token or re-login.')
                return 'error', 'Token invalid'
            elif req.status_code == 404:
                print('[xClient] The target email does not have an account associated with it')
                return 'error', 'User does not exist'
            else:
                return 'error', 'Unknown error'

    def admingetusers(self, token):
        headers = {'Token': token, 'origin':origin}
        try:
            req = requests.get(self.apiURL+'admin/getusers/a', headers=headers)
        except Exception as e:
            print(f'[xClient] xAPI may be offline or another error has occurred. Error: {e}')
            return 'error', 0
        else:
            data = json.loads(req.text)
            if req.status_code == 200:
                print('[xClient] Successfully got users data')
                u = data['users']
                return 1, u
            elif req.status_code == 401:
                print('[xClient] The token sent with the request was invalid or is missing the required permissions. Please check your token or re-login.')
                return 'error', 'Token invalid'
            else:
                return 'error', 'Unknown error'

    def admincheckfriendship(self, token, uid1, uid2):
        headers = {'Token': token, 'origin':origin}
        try:
            queryparams = {'u1': uid1, 'u2': uid2}
            req = requests.get(self.apiURL+'admin/checkfriendship/_', headers=headers, params=queryparams)
        except Exception as e:
            print(f'[xClient] xAPI may be offline or another error has occurred. Error: {e}')
            return 'error', 0
        else:
            data = json.loads(req.text)
            if req.status_code == 200:
                print('[xClient] Successfully got friendship status of users')
                fs = data['result']
                return 1, fs
            elif req.status_code == 401:
                print('[xClient] The token sent with the request was invalid or is missing the required permissions. Please check your token or re-login.')
                return 'error', 'Token invalid'
            elif req.status_code == 403:
                print('[xClient] The token sent with the request is missing the required permissions. Please check your token.')
                return 'error', 'Missing permissions'
            else:
                print(f'[xClient] Unknown error ({req.status_code=})')
                return 'error', 'Unknown error'

    def apiversion(self):
        headers = {'origin':origin}
        try:
            req = requests.get(self.apiURL, headers=headers)
        except Exception as e:
            print(f'[xClient] xAPI may be offline or another error has occurred. Error: {e}')
            return 'error', 0
        else:
            data = json.loads(req.text)
            if req.status_code == 200:
                print('[xClient] Successfully got current API version')
                return 1, data['version']
            else:
                return 'error', 'Unknown error'

    print(f'[xClient] Loaded xclient.py version {version}')