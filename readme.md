
  
## Executive Summary

The exocore is a preconfigured package to roll out your own no-code, no-cost personal website as a public exocortex from documents written in simple Markdown syntax, including interlinking, generated backlinks and a nodal graph-rendering. Site's are rendered in fast, responsive, standards-compliant static HTML.

The exocore is developed by [Remilia Collective](https://remilia.org) as a [Jamstack](https://jamstack.org/) worfklow and extension of [Foam](https://github.com/foambubble/foam) to complete the system of an accessible and standardized autopublishing knowledgebase network, with increments by [Kanon de Rothschilde](https://x.com/wagyugroyper) that intend on making the experience similar to [Gwern's](https://gwern.net) own personal website. 

This project is *UNDER DEVELOPMENT*.

## Deploy your own Exocore to the Web

### Create Github Account

First, create an account on [github.com](https://github.com/join) if you do not already have one. Remember to [make your email private](https://saraford.net/2017/02/19/how-to-hide-your-email-address-in-your-git-commits-but-still-get-contributions-to-show-up-on-your-github-profile-050/) in settings.

Continue below when you have an account ready.

### Install the Exocore template to GitHub and Netlify

Open our [One-click installation](https://app.netlify.com/start/deploy?repository=https://github.com/kvkvkv01/blog).

Steps:

1. Select `Connect to Github`
2. Login to Github and select `Authorize Application`
3. Name your repository - this is your own reference
4. Select `Deploy site`

Netlify will now take about 5 minutes for the initial build of the site. If you want, you can watch the status of the build by clicking `Production: master@HEAD` under **Production Deploys**.

Once it’s complete, the Production status will change to **Published**, and you will be able to click the `[site-name].netlify.app` link to see your site.

The site’s master files will also appear in your Github account, under the repository name you selected, e.g. `github.com/account-name/repository-name`. Changes here will go live on the site automatically.

Your site is now officially live, available for anyone to view at `[site-name].netlify.app.`, but there are some settings we should adjust before moving forward.
### Change your site name

Change the default generated site name to whatever you’d like by navigating to `Site settings > Site details > Change site name`. It will be available at `[sitename].netlify.app`
## How to Change your Username and Homepage

Navigate to `/exocore/data/user.yml`. Open the file in any text-editor (e.g. Notepad or TextEdit) and look for `user_name: default`. Change this to whatever name you want to appear on the left sidebar.
## Change your Homepage Content

In the same `/exocore/data/user.yml` file, you will also see `welcome_header` and `welcome_subtitle`. These control the title and subtitle that appear on your homepage.

On the root folder you will find `index.md`, this can be edited like any other article as your homepage with the addition of the title and header from the `user.yml` file. Make sure you keep the following frontmatter at the top of the markdown file:
```
---

layout: home

title: home

---

```
## Change your Profile Picture

The profile picture that appears on the left sidebar is located at `assets/img/pfp.png`, you can replace this file with any .png. Note that it will be resized into a square.
## Change your Social Media Card Image

The social media card that appears when your site is linked on social media sites like Twitter, Facebook, etc. is located at `assets/img/card.png`, you can replace this file with any .png. Note that a dimension of 1200x630 is recommended.

**Make sure the site's url is changed in `/_config.yml` in the next step for this image to appear.**
## Change your Site's Title and URL

Navigate to ```/_config.yml``` to change the Title and URL of your exocore. All other settings can be left as is.
## Change the Theme

The Exocore ships with multiple themes to choose from. Navigate to `/styles.scss` and look for the line that says `//Uncomment one of the following lines to choose a theme:`. To select a theme, remove `//` from the line of the theme you want to try, and add `//` to the previously active theme ("yotsuba" by default).
## Optional: Password Protection

You can add simple password protection by going to your Netlify account, entering your site, going to `Settings > Build & Deploy > Build Settings > Edit Settings` and changing `Build commannd` from the default `bundle exec jekyll build` to:

``jekyll build && npx staticrypt _site/index.html P@SSW0RD -o _site/index.html``

This will password protect the homepage with `P@SSWORD` as the password -- you can change this to anything you'd like. Note that this will only protect the homepage, users will be able to directly link to any other page and have access to the whole site.
