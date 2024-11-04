#!/usr/bin/env bash

# for creating a venv if one is not present, set this to the desired python version's bin
PYTHON_BIN=$(which python3) # use system default

SCRIPTLOCATION=$(dirname -- "$(readlink -f -- "$BASH_SOURCE")")
cd $SCRIPTLOCATION

PORT=5181
APP_NAME=simbl-server
APP_ENTRYPOINT=main
PID_FILE=/tmp/gunicorn_$APP_NAME.pid

source $SCRIPTLOCATION/venv/bin/activate

if [ "$?" == "1" ]
then
    echo "err: venv not present, creating..."
    $PYTHON_BIN -m venv venv
    echo "created prolly"
fi   

echo "installing deps..."
pip -q install -r requirements.txt
echo "complete."

echo "starting $APP_NAME"
if ! command -v gunicorn &> /dev/null
then
    echo "gunicorn was not found on the PATH, trying python module..."
    $SCRIPTLOCATION/venv/bin/python -m gunicorn --pid $PID_FILE -w 1 -b 0.0.0.0:$PORT $APP_ENTRYPOINT:app
else
    $SCRIPTLOCATION/venv/bin/gunicorn --access-logfile - --pid $PID_FILE -w 1 -b 0.0.0.0:$PORT $APP_ENTRYPOINT:app
fi

#gunicorn -w 3 --worker-class gthread -b 0.0.0.0:5555 xapi:app
