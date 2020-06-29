if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()

const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

const initializePassport = require ('./passport-config')
const { use } = require('passport')
initializePassport(
    passport, 
    email => users.find(user => user.email===email),
    id => users.find(user => user.id===id)
)

const users = []
// 
// app.use( express.static( "public" ) );
app.use(expressLayouts)
//
app.set('view engine','ejs')
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.get('/',(req,res)=>{
    res.render('index.ejs')
})

app.get('/welcome',(req,res)=>{
    res.render('welcome.ejs')
})

app.get('/error',(req,res)=>{
    res.render('error.ejs')
})



app.get('/login',(req,res)=>{
    res.render('login.ejs')
})

app.post('/login',passport.authenticate('local',{
    successRedirect: '/welcome',
    failureRedirect: '/error',
    failureFlash: true
}))


app.get('/registration',(req,res)=>{
    res.render('registration.ejs')
})
 
app.post('/registration', async(req,res)=>{
    
    try{
        
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({

            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password:hashedPassword
        })

        res.redirect('/login')

    }catch{
        res.redirect('/registration')

    }
    console.log(users)

    

})

app.listen(8080)