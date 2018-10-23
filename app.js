const path = require('path')
const logger = require('morgan')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
	
// Socket.IO
const http = require('http').Server(app)
const io = require('socket.io')(http)

const port = 3000
// Start the server
http.listen(port, () => {
    console.log('Listening on port ' + port)
})


// view engine setup
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))
// middleware
app.use(logger('dev'))

/*====================================== Routes ===================================================*/
app.use('/chat', require('./routes/chat'));
/*====================================== Routes ===================================================*/
let users = {};

io.on('connection', (socket) => {
	console.log('New Connection is here :', socket.id)
	socket.on('login', (name) => {
		users[socket.id] = name;
		socket.broadcast.emit('message', {
			from: 'Server',
			message: `${name} logged in`
		})
	})
	socket.on('message', (message) => {
		let data = {
			from: users[socket.id],
			message: message
		}

		// socket.broadcast.emit('message', data)
		io.emit('message', data)
	})

	socket.on('disconnect', () => {
		console.log('disconnect :', socket.id);
	})
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
