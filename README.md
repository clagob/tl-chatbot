# Conversation Street BOT for ThinkLife

Project for leads generation commissioned from the Prince of Gambia.

The project create a Web APP that looks like a converastion but behind the scene is a web form. At the end of the conversation the form is submitted to the CRM LUNAR and the user is redirect to an 'external' `thank-you` page.

The APP can work as single page or be embedded in an existing web page, simply adding an HTML tag and injecting an external JavaScript. This will read and replace the HTML tag with a complex HTML structure (conversation widget) that is controlled and styled by the JavaScript.

We can have many APPs with different questions (`/src/items/..`) or different style.


## Development Enviroment

### TEST ENV

http://localhost:8080/conversation-#.html

**API BOT**

http://localhost:9000/


## Folders

- `src`: Source code for JS and SCSS. Images need to be added here
- `web`: web root (for poduction)
- `test`: testing web root


---

# INSTALLATION

## Getting started: prepare your computer

If you already have the following tools installed, skip this section.

### NPM 6.9+ & Node.js 12.4+

Install it now. (https://nodejs.org)

### Docker (for API)

Be sure that the `docker` & `docker-compose` are installed.

https://www.docker.com/get-started

More info: https://docs.docker.com/install/

---

## Install all the project dependencies

```
npm i
```

`NPM` not on your computer? Install it now. (https://nodejs.org)

---

## Usage

You can use this repo in different way. Here the list for an easy understanding.

### Developer mode

To expand and add functionalities, please run this command and edit in the `/src/` folder. The code will be rebuilt on fly and automatically refreshed on the browser (`http://localhost:8080/conversation-#.html`). This command also start the docker server where is hosted the API (on port 9000).

```
npm run dev 
```

or 

```
npm run start 
```

### Build the package

Build all the distribution parts of the package (`/dist/` & `wp-content/themes/{theme_name}/dist/`).

```
npm run build
```

### Clean all the generate code

Delete all the generated files inside `/dist/`, `/tmp/` and inside the wordpress theme `/web/../dist/`.

```
npm run clean
```

### Rebuild the package

Rebuild all the distribution parts of the package (`/dist/` & `/web/../dist/`). **This task will initially clean (delete) all the previous generated files.**

```
npm run rebuild
```

## API Development

**Build and start**

```
npm run docker
```

**Then open in your browser**

```
http://localhost:9000
```

**Stop**

```
npm run docker:stop
```

**Shutdown**

This removes the containers and default network.

```
npm run docker:down
```

More info about [Docker compose](https://docs.docker.com/compose)

---

# How to use the conversation bot app

The conversation bot can be embedded in any web page just simply adding a special HTML tag and a JavaScript.

```html
<html>
...
<body>
...
<div 
  id="thinklife-conversation-1" 
  data-mcid="15016" 
  data-mcref="0" 
  data-redirect="/thank-you/"
></div>
...
<script defer src="bot/dist/conversation-1.js"></script>
</body>
</html>
```

The `<div>` tag with `id="thinklife-conversation-1"` will be replace with the conversation bot app that is generated by the JavaScript.

The app will simulate a conversation bot that will ask the user few questions to collect some information that will be submitted to a Lunar CRM campaign. 

The `campaign ID` can be set in the attribute `data-mcid="15016"`.  

The `client ref` can be set in the attibute `data-mcref="0"`.

On completion the app will redirect to a `/thank-you/` page hosted on the website (not part of the app). This page can be set using the attribute `data-redirect="/thank-you/"`.

NB: The only limitation is that the JavaScript file must be hosted on the same domain (or subdomain) where the `/api/` folder is also hosted. Normally on https://bot.lifemarket.uk/dist/conversation-1.js


## In a Bootstrap Modal

```html
<html>
...
<body>

  ...

  <button class="btn btn-primary btn-lg" type="button" data-toggle="modal" data-target="#conversation-modal">Get started</button>

  ...

  <div id="conversation-modal" class="modal fade conversation-modal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
      <div class="modal-content">
        <div class="modal-body">

          <section 
            id="thinklife-conversation-1" 
            data-mcid="15016" 
            data-mcref="0"
            data-redirect="/thank-you/"
          >
            <div class="d-flex justify-content-center py-5">
              <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  </div>

<script>
(function ($) {
  $('#conversation-modal').one('show.bs.modal', function (e) {
    setTimeout(loadCoversation1Js, 2000)
    function loadCoversation1Js () {
      var s = document.createElement('script')
      s.src = (document.location.protocol === 'https:' ? 'https:' : 'http:') + '//bot.lifemarket.uk/dist/conversation-1.js'
      document.querySelector('head').appendChild(s)
    }
  })
})(window.jQuery)
</script>

</body>
</html>
```


---

# ITEMS - How to set them up

The conversation can be very flexible allow you to create any kind of item logic.

Discover the [Item logic documentation](/src/items/README.md).


## LUNAR field list - for API

Each conversation can have different items (Q/A).
The following are the fields that we need to capture from LUNAR point of view. 
 
**Mandatory (not blank)**
- `your-firstname`: text
- `your-lastname`: text
- `your-dob`: date (age from 18 to 79)
- `your-telephone`: valid telephone
- `your-email`: email
- `mcid`: text - Lunar campaing ID 
- `mcref`: text - Lunar client reference
 
**Optional**
- `quote-id`: auto generate ID - Lunar notes
- `amount`: number
- `product-term`: number 
- `your-title`: text
- `your-postcode`:  postcode
- `your-smoke-status`: `Y` or `N`
- `quote-for`: `1` or `2` people
- `p-title`: text
- `p-firstname`: text
- `p-lastname`: text
- `p-dob`: date (age from 18 to 79)
- `notes`: text
- `your-day`: callback day (date)
- `your-time`: callback time
 
You are free to introduce, in a conversation, other items with their respective fields that you might need in the thank you page. Or simply message items.


## Field Validation Messages

**default**
- `required`: Please specify a name
- `minlength`: Please specify a longer name
- `maxlength`: Please specify a shorter name
- `min`: Please specify a value of # or higher
- `max`: Please specify a value of # or lower
- `step`: Please specify a valid value multiple of #
- `pattern`: Please specify a valid value as per requested format
- `generic`: Please specify a valid value

**Name**
- `required`: Please specify a name
- `minlength`: Please specify a longer name
- `maxlength`: Please specify a shorter name
- `pattern`: Please specify a valid value as per requested format
- `generic`: Please specify a valid value

**Date**
- `required`: Please specify a value
- `min`: Please specify a value of # or higher
- `max`: Please specify a value of # or lower
- `pattern`: Please specify a valid value as per requested format
- `generic`: Please specify a valid value

**Number**
- `required`: Please specify a value
- `min`: Please specify a value of # or higher
- `max`: Please specify a value of # or lower
- `step`: Please specify a valid value multiple of #
- `pattern`: Please specify a valid value as per requested format
- `generic`: Please specify a valid value

**Email**
- `required`: Please specify a value
- `pattern`: Please specify a valid email address
- `generic`: Please specify a valid value

**Telephone**
- `required`: Please specify a value
- `pattern`: Please specify a valid value as per requested format
- `lookup`: Please specify a valid UK phone number
- `generic`: Please specify a valid value

**Postcode**
- `required`: Please specify a value
- `pattern`: Please specify a valid UK postcode
- `generic`: Please specify a valid value
 
 ---

 # API - Authentication

 The API are open to call that are share on the same domain (including subdomains).

 If you need to set/change the domain of deployment you need to edit the file `/web/api/auth.php`

 ```php
 $ALLOW_DOMAIN = 'lifemarket.uk';
 ```
