const express = require('express');

const router = express.Router();
const Post = require('../server/model/postschema');

router.get('/', async (req, res) => {
        res.render('main');
});


router.get('/contact',(req, res)=>{
    res.render('contact');
});

router.get('/addpost',(req, res)=>{
    res.render('body');
});


router.post('/addpost', (req, res) => {
    const { title, content } = req.body;

    const newPost = new Post({
        title,
        content
    });

    newPost
        .save()
        .then(savedPost => {
            console.log('Post created successfully');
            res.redirect('/body');
        })
        .catch(error => {
            console.error('Error creating post:', error);
            res.render('posts/404page');
        });
});


router.get('/post/:id', async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await Post.findOne({ _id: postId });
        res.render('post', { post: post });
    } catch (err) {
        console.error('Error fetching post:', err);
        res.render('post', { post: null });
    }
});


router.get('/post/:id/edit', async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await Post.findById(postId);
        res.render('editpost', { post: post });
    } catch (err) {
        console.error('Error fetching post:', err);
        res.redirect('/');
    }
});

// Add a new POST route to handle post updates
router.post('/update/:id', async (req, res) => {
    const postId = req.params.id;
    const { title, content } = req.body;

    try {
        const post = await Post.findById(postId);
        post.title = title;
        post.content = content;
        await post.save();
        res.redirect(`/post/${postId}`);
    } catch (err) {
        console.error('Error updating post:', err);
        res.redirect('/');
    }
});


router.post('/delete/:id', async (req, res) => {
    const postId = req.params.id;

    try {
        const deletedPost = await Post.findOneAndDelete({ _id: postId });

        if (!deletedPost) {
            console.log('Post not found');
            res.redirect('/');
        } else {
            console.log('Post deleted successfully');
            res.redirect('/');
        }
    } catch (err) {
        console.error('Error deleting post:', err);
        res.redirect('/');
    }
});


router.get('/body', async (req, res) => {
    try {
        const posts = await Post.find({});
        const startIndex = 0; // You need to define the appropriate values for startIndex and endIndex
        const endIndex = posts.length;
        res.render('body', { posts: posts, startIndex: startIndex, endIndex: endIndex });
    } catch (err) {
        console.error('Error fetching posts for overview:', err);
        res.render('body', { posts: [], startIndex: 0, endIndex: 0 });
    }
});

router.get('/about', async (req, res) => {
    try {
        const posts = await Post.find({}); // Fetch posts from the database
        res.render('about', { posts: posts }); // Pass the posts array to the template
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.render('about', { posts: [] }); // Pass an empty array in case of an error
    }
});


module.exports = router;