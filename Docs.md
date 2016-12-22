#A Facet Client for Solr

##How to setup
Clone the project with  
`git clone https://github.com/janakact/solr-facet-client.git`

Install dependancies  
`npm install`

Run the development server  
`npm start`

Create a production build  
`npm run build`

###To use this clien you need to setup a Apache Solr client first

## Setting up solr

### Install solr

Download solr from the [download page](http://lucene.apache.org/solr/mirrors-solr-latest-redir.html) and extract the .tgz or .zip file.

### Start solr with CORS
You need to enable CORS to access Solr rest API from a different origin.
Navigate to the solr directory.
Edit the file server/etc/webdefault.xml and add these lines just above the last closing tag

```xml
	<!-- enable CORS filters (only suitable for local testing, use a proxy for real world application) -->
	<filter>
		<filter-name>cross-origin</filter-name>
		<filter-class>org.eclipse.jetty.servlets.CrossOriginFilter</filter-class>
	</filter>
	<filter-mapping>
		<filter-name>cross-origin</filter-name>
		<url-pattern>/*</url-pattern>
	</filter-mapping>
	<!--- /enable CORS filters -->
</web-app>
```

Start the solr server

```bash
	$ bin/solr start -e cloud -noprompt
```
