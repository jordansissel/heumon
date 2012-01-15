run:
	node /home/jls/node_modules/hem/bin/hem server

build:
	node /home/jls/node_modules/hem/bin/hem build

gh-pages: SOURCES=application.css application.js index.html favicon.ico
gh-pages: | build
	tar -zcf /tmp/gh-pages.tar.gz -C public $(SOURCES)
	git checkout gh-pages
	tar -zxf /tmp/gh-pages.tar.gz
	git add $(SOURCES)
	git commit $(SOURCES) -m "regenerated"
	git checkout master
