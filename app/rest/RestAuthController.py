import json
from cachetools import TTLCache
import requests
import datetime
import time
import ssl
import sys
import os
import urllib.parse
import logging

import Config



class RestAuthController():
    target_url = ''

    def __init__(self, authcode=None, redirect_url=None):

        self.logger = logging.getLogger(name='learn')
        
        self.KEY = Config.config['learn_rest_key']
        self.SECRET = Config.config['learn_rest_secret']

        self.CREDENTIALS = 'authorization_code'
        
        self.PAYLOAD = {
            'grant_type':'authorization_code'
        }

        self.BASIC_PAYLOAD = {
            'grant_type':'client_credentials'
        }

        self.TOKEN = None
        self.target_url = Config.config['learn_rest_url']

        if redirect_url is None:
            self.redirect_url = f"{Config.config['app_url']}/authcode/"
        else:
            self.redirect_url = redirect_url

        self.authcode = authcode

        self.EXPIRES_AT = ''
        
        if Config.config['verify_certs'] == 'True':
            self.verify_certs = True
        else:
            self.verify_certs = False

        self.cache = None
        self.basic_cache = None

        self.uuid = None
        
    def getKey(self):
        return self.KEY

    def getSecret(self):
        return self.SECRET

    def setToken(self):
        try:
            if self.cache != None:
                token = self.cache['token']
            else:
                self.requestToken()
        except KeyError:
            self.requestToken()

    def requestToken(self):
        OAUTH_URL = 'https://' + self.target_url + '/learn/api/public/v1/oauth2/token?code=' + self.authcode + '&redirect_uri=' + self.redirect_url

        # Authenticate
        self.logger.info("[auth:setToken] POST Request URL: " + OAUTH_URL)
        self.logger.debug("[auth:setToken] JSON Payload: \n" + json.dumps(self.PAYLOAD, indent=4, separators=(',', ': ')))
        
        r = requests.post(OAUTH_URL, data=self.PAYLOAD, auth=(self.KEY, self.SECRET), verify=self.verify_certs)

        self.logger.info("[auth:setToken()] STATUS CODE: " + str(r.status_code) )
        #strip quotes from result for better dumps
        res = json.loads(r.text)
        self.logger.debug("[auth:setToken()] RESPONSE: \n" + json.dumps(res,indent=4, separators=(',', ': ')))

        if r.status_code == 200:
            parsed_json = json.loads(r.text)
            
            self.cache = TTLCache(maxsize=1, ttl=parsed_json['expires_in'])

            self.cache['token'] = parsed_json['access_token']
            self.uuid = parsed_json['user_id']


            self.logger.debug ("[auth:setToken()] TOKEN: " + self.getToken())

        else:
            self.logger.error("[auth:setToken()] ERROR")
    
    def getToken(self):
        try:
            token = self.cache['token']

            return token
        except TypeError:
            self.setToken()
    
            return self.cache['token']
        except KeyError:
            self.setToken()
    
            return self.cache['token']

    def setBasicToken(self):
        try:
            if self.basic_cache != None:
                token = self.basic_cache['basic_token']
            else:
                self.requestBasicToken()
        except KeyError:
            self.requestBasicToken()

    def requestBasicToken(self):
        OAUTH_URL = 'https://' + self.target_url + '/learn/api/public/v1/oauth2/token'

        # Authenticate
        self.logger.info("[auth:setToken] POST Request URL: " + OAUTH_URL)
        self.logger.debug("[auth:setToken] JSON Payload: \n" + json.dumps(self.PAYLOAD, indent=4, separators=(',', ': ')))
        
        r = requests.post(OAUTH_URL, data=self.BASIC_PAYLOAD, auth=(self.KEY, self.SECRET), verify=self.verify_certs)

        self.logger.info("[auth:setToken()] STATUS CODE: " + str(r.status_code) )
        #strip quotes from result for better dumps
        res = json.loads(r.text)
        self.logger.debug("[auth:setToken()] RESPONSE: \n" + json.dumps(res,indent=4, separators=(',', ': ')))

        if r.status_code == 200:
            parsed_json = json.loads(r.text)
            
            self.basic_cache = TTLCache(maxsize=1, ttl=parsed_json['expires_in'])

            self.basic_cache['basic_token'] = parsed_json['access_token']
            
            self.logger.debug ("[auth:setToken()] TOKEN: " + self.getBasicToken())

        else:
            self.logger.error("[auth:setToken()] ERROR")
    
    def getBasicToken(self):
        try:
            token = self.basic_cache['basic_token']

            return token
        except TypeError:
            self.setBasicToken()
    
            return self.basic_cache['basic_token']
        except KeyError:
            self.setBasicToken()
    
            return self.basic_cache['basic_token']

    def getUuid(self):
        return(self.uuid)