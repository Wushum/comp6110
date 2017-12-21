var http = require('http')
var url = require('url')
var qs = require('querystring')
var mysql = require('mysql')

var filer = require('./lib/filer')

const hostname = '127.0.0.1'
const port = 3000

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "park13",
	database: "project"
  });
  
  
con.connect(function(err) {
    if (err) throw err;
    console.log("MySQL Connected!");
	
});
  


http.createServer(function(request, response){

    request.on('error', (err) => {
        console.error(err)
        response.setHeader('Content-Type', 'text/html')
        response.statusCode = 400
        response.end()
    })

    response.on('error', (err) => {
        console.error(err)
    })

    var urlParsed = url.parse(request.url, true)
    var filename = /*"." +*/ urlParsed.pathname
    var query = urlParsed.query
    
    console.log(request.url)
    console.log(urlParsed.pathname)
    console.log(filename)
    console.log(query)

    // FETCHING
    if (request.method === 'GET') {
        switch (urlParsed.pathname) {
            case '/':
            case '/index':
            // do custom data manipulation etc
            filer(response, '/tellerLogin.html', {
                // name : "Cecil",
                // skills: ["js", "html", "css"] ///filer take response, filename
            })
            break
												//queryParamater
            case '/echo':
            filer(response, filename, {})
            break
			
			case '/data':
			
			var sql = "select * from project.customer;"

		con.query(sql, function (err, result) {
		if (err) throw err;
		var keys = Object.keys(result)
		var pageResults = []
		for (var k in keys) {
		var row = result[k]
		console.log(row)
		pageResults.push({
		firstname : 	row.firstname,
		lastname : 		row.lastname,
		account_no : 	row.account_no,
		address	: 		row.address,
		trn: 			row.trn,
		email_address: 	row.email_address,
		status:			row.status,
		phone_no:		row.phone_no,
		secret_key:		row.secret_key
      })
  }
  filer(response, filename, {
      data : pageResults
    })
});
			break
			
            default:
            filer(response, filename)
        }
    } else

    // CREATING
    if (request.method === 'POST'){
        switch (urlParsed.pathname) {
            case "/modify":
             let body = []
            request
            .on('data', (chunk) => {
                body.push(chunk)
                /*if (body.length > 1e6)
                request.connection.destroy()*/
            })
            .on('end',() => {
                body = Buffer.concat(body).toString()
                var post = qs.parse(body)
                console.log(post)
                // validation
                // pass into database
				
var sql = "insert into project.customer(firstname, lastname, account_no, address, trn, email_address, status, phone_no, secret_key) values  ('"+post.firstname+"','" + post.lastname + "', '"+post.account_no+"', '"+post.address+"', '" + post.trn + "', '"+post.email_address+"', '"+post.status+"', '"+post.phone_no+"', '"+post.secret_key+"');"
//var sql = "select * from project.customer;"
console.log(sql);
con.query(sql, function (err, result) {
  if (err) throw err;
  console.log("Result: " + result);
});	
				
				
                response.end(body)
				
            })
            break
            
            default: break
        }
    } else
    
    // UPDATING
    if (request.method === 'PUT') {
        switch (urlParsed.pathname) {
            case '/':
            break
            case '/echo':
            break
            default:
            response.statusCode = 404
            response.end()
        }
    } else

    // DELETING
    if (request.method === 'DELETE') {
        switch (urlParsed.pathname) {
            case '/':
            break
            case '/echo':
            break
            default:
            response.statusCode = 404
            response.end()
        }
    } 
    // BAD REQUEST (ROUTE)
    else {
        response.setHeader('Content-Type', 'text/html')
        response.statusCode = 400
        response.end()
    }
    
}).listen(port, hostname,  () => {
    console.log(`server running at http://${hostname}:${port}/`)
})


// app.listen("3000")=> {
	// if (err){ throw err
	// }
// console.log("port open");	
// }