import {
    ErrorHandler,
    HandlerInput,
    RequestHandler,
    SkillBuilders,
  } from 'ask-sdk-core';
  import {
    Response,
    SessionEndedRequest,
  } from 'ask-sdk-model';
import * as fs from 'fs';

  const LaunchRequestHandler : RequestHandler = {
    canHandle(handlerInput : HandlerInput) : boolean {
      return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput : HandlerInput) : Response {
      const speechText = 'GET OUT. GET OUT. GET OUT. GET OUT. GET OUT. GET OUT. ';
  
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .withSimpleCard('GET OUT', speechText)
        .getResponse();
    },
  };

  const GhostStoryIntentHandler : RequestHandler = {
      canHandle(handlerInput : HandlerInput) : boolean {
          return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'GhostStoryIntent';
      },
      handle(handlerInput : HandlerInput) : Response {
          const stories = fs.readFileSync('./stories.txt', 'utf-8').split(/\r?\n/);

          const speechText = stories[Math.floor(Math.random() * stories.length)];

          return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Ghost Story', speechText)
            .getResponse();
      },
  };

let skill;

const handler = async (event, context) => {
    console.log(`REQUEST+++++${JSON.stringify(event)}`);
    if (!skill) {
        skill = SkillBuilders.custom()
            .addRequestHandlers(
                LaunchRequestHandler,
                GhostStoryIntentHandler
            )
            .create();
    }

    const response = await skill.invoke(event, context);
    console.log(`RESPONSE+++++${JSON.stringify(response)}`);

    return response;
}

export {handler};