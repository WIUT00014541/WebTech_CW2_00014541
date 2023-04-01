const express = require('express')
const app = express()

const fs = require('fs')

app.set('view engine', 'pug')
app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: false}))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/create', (req, res) => {
    res.render('create')
})

app.post('/create', (req, res) => {
    const title = req.body.title
    const description = req.body.description

    if(title.trim() === '' && description.trim() === '') {
        res.render('create', { error: true })
    } 
    else {
        fs.readFile('./data/blog.json', (err, data) =>{
            if (err) throw err

            const posts = JSON.parse(data)

            posts.push({
                id: id (),
                title:title,
                description: description,
            })

            fs.writeFile('./data/blog.json', JSON.stringify(posts), err => {
                if (err) throw err

                res.render('create', { success:true })
            })
        })
    }

    
})



app.get('/posts', (req, res)=>{

    fs.readFile('./data/blog.json', (err, data) => {
        if (err) throw err

        const posts = JSON.parse(data)
        res.render('posts', { posts: posts})
    })
    
})




app.get('/posts/:id', (req, res) => {
    const id = req.params.id
    fs.readFile('./data/blog.json', (err, data) => {
        if (err) throw err

        const posts = JSON.parse(data)
        const post = posts.filter(post => post.id == id)[0]

        res.render('detail', { post: post })
    })
    
})

app.get('/posts/:id/delete', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/blog.json', (err, data) => {
        if (err) throw err

        const posts = JSON.parse(data)
        const post = posts.filter(post => post.id != id)

        fs.writeFile('./data/blog.json', JSON.stringify(post), (err) => {
            if (err) throw err

            res.render('posts', {posts: post, deleted: true })
        })

        
    })
})

app.get('/api1/v1/posts', (req, res) => {
    fs.readFile('./data/blog.json', (err, data) => {
        if (err) throw err

        const posts = JSON.parse(data)

        res.json(posts)
    })
    
})


app.listen(8000, err => {
    if (err) console.log(err)
    console.log('Server is running')
})

function id () {
    return '_' + Math.random().toString(36).substr(2, 9);
}