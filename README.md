# nodejspractice_complexapp
FreedomApp.  
No more short tweets and impersonal “shared” posts that are similar to the late 90’s email forwards. FreedomApp believes that actual writing is the key to a better the world wide web.    

## What's the purpose of this project?
Just to be able to practice more of NodeJS and general web development techniques.  
I believe it's essential to know these stuffs before I can move on to Blockchain Development.  

## What's this app about?
This project is a simple social media website.  
It's like Twitter but without the share (retweet) feature to encourage people to write/post original stuffs.  

## What are the features of this app?
* User registration. The app will automatically create the user profile and grab the avatar from gravatar.com (using your email) if it exists.  
* Log-in and Log-out.  
* Post a content. The author can update and delete any contents that he/she owns.  
* Any users (when logged in) can search for posts via the search icon from the header.  
* A user can also chat with everyone (logged in users). To access the chat, you have to click the chat icon from the header.  
* The app was built in a Model-View-Controller (MVC) design pattern.  
* This app also features a Cross-site request forgery (CSRF) protection.  

## What does this app lack?
* No front-end framework.  
* The user cannot change the username, password, and email after registration.  
* There's no "like" feature.  

## What's the stack used on this project?
MongoDB, Express, NodeJS.  

Libraries and APIs:
1. express-session
2. connect-mongo
3. connect-flash
4. marked
5. sanitize-html
6. axios
7. dompurify
8. socket.io
9. webpack
10. dotenv
11. bcryptjs
12. md5
13. validator
14. csurf

## What resource(s) did I use to create this app?
* [Stack Overflow](https://stackoverflow.com/)  
* [Brad Schiff's JavaScript Course](https://www.udemy.com/course/learn-javascript-full-stack-from-scratch)

## SCREENSHOT
![Alt text](/screenshots/screenshot-guest-homepage.JPG?raw=true "Homepage")  
![Alt text](/screenshots/screenshot-homepage-dashboard.JPG?raw=true "Homepage Dashboard")  
![Alt text](/screenshots/screenshot-profile-page.JPG?raw=true "Profile Page")  
![Alt text](/screenshots/screenshot-view-others-profile?raw=true "Others Profile Page")  
![Alt text](/screenshots/screenshot-creating-a-post-page.JPG?raw=true "Create A Post Page")  
![Alt text](/screenshots/screenshot-edit-post?raw=true "Edit A Post Page")  
![Alt text](/screenshots/screenshot-searchbar?raw=true "Search bar")  
![Alt text](/screenshots/screenshot-chat?raw=true "Chat window")  