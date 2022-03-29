/*
 * Copyright (C) 2019, Blackboard Inc.
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *  -- Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 *
 *  -- Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *
 *  -- Neither the name of Blackboard Inc. nor the names of its contributors
 *     may be used to endorse or promote products derived from this
 *     software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY BLACKBOARD INC ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL BLACKBOARD INC. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

class LoggedMessageChannel {

    onmessage = () => { 
        console.log('test');
    };
  
    constructor(messageChannel) {
        this.messageChannel = messageChannel;
        this.messageChannel.onmessage = this.onMessage;
    }
  
    onMessage = (evt) => {
        console.log(`[UEF] From Learn Ultra:`, evt.data);
        this.onmessage(evt);
    };
  
    postMessage = (msg) => {
        console.log(`[UEF] To Learn Ultra`, msg);
        this.messageChannel.postMessage(msg);
    }

}

class CourseDetailsExtension {
    constructor(name, displayOptions) {
        this._name = name;
        this._displayOptions = displayOptions;
        this._callbackId = `bbdn-panel-${++callbackId}`;
        this._openModelCallback = `open-model-${++callbackId}`;
        this._courseId = undefined;

        this._panelContent = {
            tag: 'span',
            props: {
                style: {
                    display: 'flex',
                    height: '100%',
                    width: '100%',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    justifyContent: 'stretch',
                },
            },
            children: [{
                tag: 'iframe',
                props: {
                    style: {
                        flex: '1 1 auto',
                    },
                    src: panel_url,
                },
            }]
        };
    }

    setPortalId(id) {
        this._portalId = id;
    }

    setRegistrationId(id) {
        this._registrationId = id;
    }

    setCourseId(id) {
        this._courseId = id;
    }

    get courseId() {
        return this._courseId;
    }

    get name() {
        return this._name;
    }

    get registrationId() {
        return this._registrationId;
    }

    get callbackId() {
        return this._callbackId;
    }

    get openModelCallback() {
        return this._openModelCallback;
    }

    calculateContents() {
         const uefContent = {
            tag: 'div',
            props: {
                className: 'uef--course-details--container',
            },
            children: [
                {
                    tag: 'button',
                    props: {
                        className: 'uef--button--course-details',
                        onClick: {
                            callbackId: `${this._callbackId}`,
                            mode: 'sync',
                        }
                    },
                    children: [
                        {
                            tag: 'div',
                            props: {
                                className: 'uef--course-details--image'
                            },
                            children: [
                                {
                                    tag: 'img',
                                    props: {
                                        alt: 'Blackboard logo',
                                        src: 'https://www.blackboard.com/themes/custom/blackboard/images/Blackboard-Logo.png',
                                        height: 24,
                                        width: 24
                                    },
                                }
                            ]
                        },
                        {
                            tag: 'div',
                            props: {
                                className: 'uef--course-details--element'
                            },
                            children: [
                                {
                                    tag: 'div',
                                    props: {
                                        className: 'uef--course-details--name'
                                    },
                                    children: this._displayOptions.label
                                },
                                {
                                    tag: 'div',
                                    props: {
                                        className: 'uef--course-details--content'
                                    },
                                    children: [
                                        {
                                            tag: 'div',
                                            props: {
                                                className: 'uef--course-details--link'
                                            },
                                            children: this._displayOptions.details
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
            ]
        };

        if (this._displayOptions.disabled) {
            uefContent.children[0].props.disabled = 'disabled';
            uefContent.children[0].props.className += ' uef--button--disabled';
        }

        return uefContent;
    }

    render() {
        if (!this._content) {
            this._content = this.calculateContents();
        }
        messageChannel.postMessage({
            type: "portal:render",
            portalId: this._portalId,
            contents: this._content
        });
    }

    remove() {
        messageChannel.postMessage({
            type: "portal:render",
            portalId: this._portalId,
            contents: {}
        });
    }

    renderPanel(panelPortalId) {
        messageChannel.postMessage({
            type: 'portal:render',
            portalId: panelPortalId,
            contents: this._panelContent
        });
    }
}

const getNavigationContents = (routeName) => {
    return {
        "tag": "ButtonLink",
        "props": {
            "style": {
                "minHeight": "52px",
                "display": "flex",
                "flexDirection": "row",
                "justifyContent": "flex-start",
                "alignItems": "center",
                "width": "100%",
                "paddingLeft": "12px"
            },
            "to": routeName,
            "className": "uef--base-nav-button"
        },
        "children": [
            {
                "tag": "SvgIcon",
                "props": {
                    "className": "svg-icon medium-icon default",
                    "style": {
                        "display": "inline-block",
                        "left": "12px",
                        "fontSize": "18px",
                        "lineHeight": "1.1",
                        "marginRight": "14px",
                        "textAlign": "center",
                        "verticalAlign": "middle"
                    },
                    "height": "24px",
                    "width": "24px",
                    "url": badge
                }
            },
            {
                "tag": "span",
                "children": "Quick Enroll"
            }
        ]
    }
}

// Verify that we're in the integration iframe
if (!window.parent) {
    throw new Error('Not within iframe');
}

/* Initialize messageChannel */
let messageChannel;

let panel_url = app_url + '/catalog/display/';
let badge = app_url + '/static/xss.svg';

let callbackId = 0;

window.CourseDetailsExtension = CourseDetailsExtension;

const basenavRouteName = 'quickEnroll';
const quickEnroll = new CourseDetailsExtension('Quick Enroll', { label: 'Quick Enroll', details: 'Enroll in this course' });
const quickUnenroll = new CourseDetailsExtension('Quick Unenroll', { label: 'Quick Unenroll', details: 'Unenroll from this course' });



/* Add an event listener to listen for messages. When one is received, call onPostMessageReceived() */
window.addEventListener("message", onPostMessageReceived, false);

/* Post a message to tell Ultra we are here. learn_url is a variable set in index.html  */
window.parent.postMessage({"type": "integration:hello"}, learn_url + '/*');

/*
 * Called when we receive a message. 
 */
function onPostMessageReceived(evt) {

    // Determine whether we trust the origin of the message. learn_url is a variable set in index.html
    const fromTrustedHost = evt.origin === window.__lmsHost || evt.origin === learn_url;

    if (!fromTrustedHost || !evt.data || !evt.data.type) {
        return;
    }

    // If Ultra is responding to our hello message
    if (evt.data.type === 'integration:hello') {

        //Create a logged message channel so messages are logged to the Javascript console
        messageChannel = new LoggedMessageChannel(evt.ports[0]);
        messageChannel.onmessage = onUltraMessageReceived;
  
        // Ultra is listening. Authorize ourselves using the REST token we received from 3LO
        // token is a variable set in index.html
        messageChannel.postMessage({
            type: 'authorization:authorize',
            token: token
        });
    }
  
}

function renderCatalog() {
    return {
        tag: 'div',
        props: {
            style: {
                display: 'flex',
                height: '100%',
                width: '100%',
                flexDirection: 'column',
                alignItems: 'stretch',
                justifyContent: 'stretch',
            },
        },
        children: [{
            tag: 'iframe',
            props: {
                style: {
                    flex: '1 1 auto',
                },
                src: panel_url,
            },
        }]
    }
}

function renderModal() {
    return {
        tag: 'Modal',
        props: {
            width: 'small'
        },
        children: [
            {
                tag: 'ModalHeader',
                props: {
                    title: 'Integration Modal',
                },
            },
            {
                tag: 'ModalBody',
                children: [
                    {
                        tag: 'div',
                        props: {},
                        children: 'Congrats'
                    }
                ]
            },
            {
                tag: 'ModalFooter',
                children: [
                    {
                        tag: 'button',
                        props: {
                            onClick: {
                                callbackId: 'modal-close-callback'
                            },
                            key: 'idk',
                            className: 'uef--button'
                        },
                        children: 'Close'
                    }
                ]
            }
        ]
    };
}

let id;
let notificationSize = 'small';

const getContents = (message) => {
    return {
        tag: 'Notification',
        props: {
            size: notificationSize
        },
        children: [
            {
                tag: 'div',
                children: [
                    {
                        tag: 'span',
                        props: {
                            style: {
                                padding: '8px'
                            }
                        },
                        children: message,
                    }
                ]
            }
        ]
    }
}

function createNotification(message) {
    messageChannel.postMessage({
        "type": "portal:notification",
        "selector": {
            type: "notification:analytics:selector",
            value: "feature.base.stream.notification.bar.create.button"
        },
        "contents": getContents(message)
    });
}

async function handleEnrollments(courseId,mode) {
    data={courseId:courseId,mode:mode};
    const response = await fetch('/enrollments/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    
    return response.ok;
}

function handleAuthorize() {
    console.log('authorization success');

    messageChannel.postMessage({
        "type": "basenav:register",
        "routeName": basenavRouteName,
        "displayName": 'Quick Enroll',
        "initialContents": getNavigationContents(basenavRouteName),
    });
    messageChannel.postMessage({
        "type": "course:detail:register",
        "registrationName": quickEnroll.name
    });
    messageChannel.postMessage({
        "type": "course:detail:register",
        "registrationName": quickUnenroll.name
    });
    messageChannel.postMessage({
        type: "event:subscribe",
        subscriptions: ["portal:new", "portal:remove", "route"]
    });
}

function handleRegisterResponse(messageData) {
    if (messageData.registrationName === quickUnenroll.name) {
            quickUnenroll.setRegistrationId(messageData.registrationId)
    } else if (messageData.registrationName === quickEnroll.name) {
        quickEnroll.setRegistrationId(messageData.registrationId)
    }
}

const handleUEFEvents = async (messageData) => {
    switch (messageData.eventType) {
        case "portal:remove": {
            if (messageData.selector === "course.outline.details" && 
                messageData.selectorData.registrationName === quickUnenroll.name) {
                quickUnenroll.setPortalId(undefined);
            } else if (messageData.selector === "course.outline.details" && 
            messageData.selectorData.registrationName === quickEnroll.name) {
            quickEnroll.setPortalId(undefined);
        }
            
            break;
        }
        case "portal:new":
            console.log("received new portal event: ", messageData.selector);

            switch (messageData.selector) {
                case 'base.integration': {
                  
                    messageChannel.postMessage({
                        "type": "portal:render",
                        "portalId": messageData.portalId,
                        "contents": renderCatalog()
                    });
                    break;
                }
                case 'base.navigation.button': {
                    setTimeout(() => {
                        const contentsToSend = getNavigationContents(basenavRouteName, 'NEW');
      
                        messageChannel.postMessage({
                            "type": "portal:render",
                            "portalId": messageData.portalId,
                            "contents": contentsToSend,
                        });
                    }, 5000);
                    break;
                }
                case 'course.outline.details': {
                    if( messageData.selectorData && 
                        messageData.selectorData.registrationId === quickUnenroll.registrationId) {
                        const response = await fetch(app_url + '/enrollments/' + messageData.selectorData.courseId + '/'); // Generate the Response object
                        
                        quickUnenroll.setPortalId(messageData.portalId);
                        quickUnenroll.setCourseId(messageData.selectorData.courseId);
                        quickEnroll.setPortalId(messageData.portalId);
                        quickEnroll.setCourseId(messageData.selectorData.courseId);
                        
                        if (response.ok) {
                            quickUnenroll.render();
                        } else {
                            quickEnroll.render();
                        }
                    }
                    break;
                }
            }
    }
}

function handlePortalCallback(messageData) {
    console.log(`Recieved callback ${messageData.callbackId}`);
    
    if (messageData.callbackId) {
        if(messageData.callbackId === quickUnenroll.callbackId) {
        
            const response = handleEnrollments(quickUnenroll.courseId,false);
                        
            if (response) {
                createNotification('You successfully unenrolled');
                quickEnroll.render()
                quickUnenroll.remove()
            } else {
                createNotification('Unenroll request failed');
            }
        } else if(messageData.callbackId === quickEnroll.callbackId) {
        
            const response = handleEnrollments(quickEnroll.courseId,true);
                        
            if (response) {
                createNotification('You successfully enrolled');
                quickUnenroll.render()
                quickEnroll.remove()
            } else {
                createNotification('Enroll request failed');
            }
        }
    }
}

const onUltraMessageReceived = (msg) => {
    console.log(`Received message ${msg.data.type}`, msg);

    switch (msg.data.type) {
        case 'authorization:authorize':
            handleAuthorize();
            break;
        case 'course:detail:register':
            handleRegisterResponse(msg.data);
            break;
        case 'event:event':
            handleUEFEvents(msg.data);
            break;
        case 'portal:callback':
            handlePortalCallback(msg.data);
            break;
    }
}