run:
	node /home/jls/node_modules/hem/bin/hem server

build:
	node /home/jls/node_modules/hem/bin/hem build

heroku-deploy: | build
	git add public/application.css public/application.js
	git commit public/application.css public/application.js -m "regenerated"
	git push heroku-2 master

gh-pages: SOURCES=application.css application.js index.html favicon.ico
gh-pages: | build
	tar -zcf /tmp/gh-pages.tar.gz -C public $(SOURCES)
	git checkout gh-pages
	tar -zxf /tmp/gh-pages.tar.gz
	git add $(SOURCES)
	git commit $(SOURCES) -m "regenerated"
	git checkout master
