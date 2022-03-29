import requests
import json
import logging

import Config

class RestCourseController:

    def __init__(self, target_url, token=None, basic_token=None):
        self.logger = logging.getLogger(name='learn')

        self.target_url = target_url
        
        if token is not None:
            self.token = token
        
        if basic_token is not None:
            self.basic_token = basic_token
        
        self.verify_certs = True

    def getCourseCatalog(self, ENDPOINT=None):
        
        if ENDPOINT is None:
            ENDPOINT = 'https://' + self.target_url + '/learn/api/public/v3/courses?sort=created(desc)'

        courses = []

        self.logger.debug('[Courses:getCourses()] token: ' + self.token)
        #"Authorization: Bearer $token"
        authStr = 'Bearer ' + self.token
        self.logger.debug('[Courses:getCourses()] authStr: ' + authStr)
        

        self.logger.info("[Courses:getCourses()] GET Request URL: " + ENDPOINT)
        self.logger.debug("[Courses:getCourses()] JSON Payload: NONE REQUIRED")

        r = requests.get(ENDPOINT, headers={'Authorization':authStr},  verify=self.verify_certs)

        self.logger.info("[Courses:getCourses()] STATUS CODE: " + str(r.status_code) )
        
        if r.text:
            res = json.loads(r.text)
            self.logger.debug(json.dumps(res,indent=4, separators=(',', ': ')))
            
            for course in res['results']:
                
                self.logger.info("[Courses:getCourses()] course: " + str(course))

                self.logger.info(course['courseId'])

                isEnrolled = False
            
                if 'externalAccessUrl' in course:
                    isEnrolled = True

                courseId = "No Id Specified"

                if "id" in course:
                    courseId = course['id']

                courseName = "No Name Specified"

                if "name" in course:
                    courseName = course['name']

                courses.append({
                    "id" : courseId,
                    "name" : courseName,
                    "isEnrolled" : isEnrolled
                })
            
            next_page = None
            
            if 'paging' in res:
                if 'nextPage' in res['paging']:
                    next_page = res['paging']['nextPage']

        else:
            self.logger.info("[Courses:getCourses()]: No courses returned")
        
        self.logger.info('courses: ' + str(courses))
        self.logger.info('next_page: ' + str(next_page))
        
        return(courses,next_page)

    def searchCourseCatalogByName(self, query, uuid):
        
        ENDPOINT = f'https://{self.target_url}/learn/api/public/v3/courses?name={query}'

        courses = []

        self.logger.debug('[Courses:getCourses()] token: ' + self.token)
        #"Authorization: Bearer $token"
        authStr = 'Bearer ' + self.token
        self.logger.debug('[Courses:getCourses()] authStr: ' + authStr)
        

        self.logger.info("[Courses:getCourses()] GET Request URL: " + ENDPOINT)
        self.logger.debug("[Courses:getCourses()] JSON Payload: NONE REQUIRED")

        r = requests.get(ENDPOINT, headers={'Authorization':authStr},  verify=self.verify_certs)

        self.logger.info("[Courses:getCourses()] STATUS CODE: " + str(r.status_code) )
        
        if r.text:
            res = json.loads(r.text)
            self.logger.debug(json.dumps(res,indent=4, separators=(',', ': ')))
            
            for course in res['results']:
                print(f"course is {course}")
                self.logger.info("[Courses:getCourses()] course: " + str(course))

                self.logger.info(course['courseId'])

                pkid = "No Id Specified"

                if "id" in course:
                    pkid = course['id']

                courseId = "No Course Id Specified"

                if "courseId" in course:
                    courseId = course['courseId']

                courseName = "No Name Specified"

                if "name" in course:
                    courseName = course['name']

                externalAccessUrl = "No URL Specified"

                if "externalAccessUrl" in course:
                    externalAccessUrl = course['externalAccessUrl']

                courses.append({
                    "id" : pkid,
                    "courseId" : courseId,
                    "name" : courseName,
                    "url" : externalAccessUrl,
                    "isEnrolled" : self.isEnrolled(pkid,uuid)
                })
            
            next_page = None
            
            if 'paging' in res:
                if 'nextPage' in res['paging']:
                    next_page = res['paging']['nextPage']

        else:
            self.logger.info("[Courses:getCourses()]: No courses returned")
        
        self.logger.info('courses: ' + str(courses))
        self.logger.info('next_page: ' + str(next_page))
        
        return(r.status_code, courses)
    
    def searchCourseCatalogByCourseId(self, query, uuid):
        
        ENDPOINT = f'https://{self.target_url}/learn/api/public/v3/courses?courseId={query}'

        courses = []

        self.logger.debug('[Courses:getCourses()] token: ' + self.token)
        #"Authorization: Bearer $token"
        authStr = 'Bearer ' + self.token
        self.logger.debug('[Courses:getCourses()] authStr: ' + authStr)
        

        self.logger.info("[Courses:getCourses()] GET Request URL: " + ENDPOINT)
        self.logger.debug("[Courses:getCourses()] JSON Payload: NONE REQUIRED")

        r = requests.get(ENDPOINT, headers={'Authorization':authStr},  verify=self.verify_certs)

        self.logger.info("[Courses:getCourses()] STATUS CODE: " + str(r.status_code) )
        
        if r.text:
            res = json.loads(r.text)
            self.logger.debug(json.dumps(res,indent=4, separators=(',', ': ')))
            
            for course in res['results']:
                
                self.logger.info("[Courses:getCourses()] course: " + str(course))

                self.logger.info(course['courseId'])

                pkid = "No Id Specified"

                if "id" in course:
                    pkid = course['id']

                courseId = "No Course Id Specified"

                if "courseId" in course:
                    courseId = course['courseId']

                courseName = "No Name Specified"

                if "name" in course:
                    courseName = course['name']

                externalAccessUrl = "No URL Specified"

                if "externalAccessUrl" in course:
                    externalAccessUrl = course['externalAccessUrl']

                courses.append({
                    "id" : pkid,
                    "courseId" : courseId,
                    "name" : courseName,
                    "url" : externalAccessUrl,
                    "isEnrolled" : self.isEnrolled(pkid,uuid)
                })
            
            next_page = None
            
            if 'paging' in res:
                if 'nextPage' in res['paging']:
                    next_page = res['paging']['nextPage']

        else:
            self.logger.info("[Courses:getCourses()]: No courses returned")
        
        self.logger.info('courses: ' + str(courses))
        self.logger.info('next_page: ' + str(next_page))
        
        return(r.status_code, courses)
    
    def modEnrollment(self, courseId, userId, mode):
        ENDPOINT = 'https://' + self.target_url + '/learn/api/public/v1/courses/' + courseId + '/users/uuid:' + userId

        self.logger.debug('[Courses:modEnrollment()] token: ' + self.token)
        #"Authorization: Bearer $token"
        authStr = 'Bearer ' + self.token
        self.logger.debug('[Courses:modEnrollment()] authStr: ' + authStr)
        

        if mode == "true" or mode == True:
            self.logger.info("[Courses:modEnrollment()] Request PUT URL: " + ENDPOINT)

            r = requests.put(ENDPOINT, json={ 'courseRoleId': 'Student' }, headers={'Authorization':authStr, 'Content-Type' : 'application/json'},  verify=self.verify_certs)
            if r.status_code != 201:
                res = json.loads(r.text)
                self.logger.error("error: " + str(r.status_code) + ": " + str(res))
        else:
            self.logger.info("[Courses:modEnrollment()] Request DELETE URL: " + ENDPOINT)
            r = requests.delete(ENDPOINT, headers={'Authorization':authStr},  verify=self.verify_certs)

        print("[Courses:modEnrollment()] STATUS CODE: " + str(r.status_code) )
        #print("[Courses:getUser()] RESPONSE:" + str(r.text))
        return r.status_code

    def isEnrolled(self, courseId, userId, return_code=None):
        ENDPOINT = 'https://' + self.target_url + '/learn/api/public/v1/courses/' + courseId + '/users/uuid:' + userId

        self.logger.debug('[Courses:modEnrollment()] token: ' + self.token)
        #"Authorization: Bearer $token"
        authStr = 'Bearer ' + self.token
        self.logger.debug('[Courses:modEnrollment()] authStr: ' + authStr)
        

        self.logger.info("[Courses:modEnrollment()] Request PUT URL: " + ENDPOINT)

        r = requests.get(ENDPOINT, headers={'Authorization':authStr, 'Content-Type' : 'application/json'},  verify=self.verify_certs)

        if return_code:
            return r.status_code

        if r.status_code == 200:
            return True
        else:
            return False