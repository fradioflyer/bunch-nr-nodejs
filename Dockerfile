#Use the IBM Node image as a base image
FROM registry.ng.bluemix.net/ibmnode:latest

#Expose the port for your Personal Insights app, and set
#it as an environment variable as expected by cf apps
ENV PORT=3000
EXPOSE 3000
ENV NODE_ENV production
ENV TwilioAcctSID=<Account_SID>
ENV TwilioToken=<Auth_Token>
ENV ToSMS=<Mobile Phone # validated by Twilio>
ENV FromSMS=<Twilio issued virtual #>

#Copy all app files from the current directory into the app
#directory in your container. Set the app directory
#as the working directory
ADD . /app
WORKDIR /app

#Install any necessary requirements from package.json
RUN npm install

#Sleep before the app starts. This command ensures that the
#IBM Containers networking is finished before the app starts.
CMD (sleep 60; npm start)

#Start the Personal Insight app.
CMD ["node", "/app/app.js"]
