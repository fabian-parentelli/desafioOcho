import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.post('/register', passport.authenticate('register', {failureRedirect: '/'}), async(req, res) => {
    res.send({status: 'success', message: 'User registerd'});
});

router.post('/login', passport.authenticate('login', {failureRedirect: '/'}), async (req, res) => {
    if(!req.user) return res.status(500).send({status: 'error', error: 'Invalis Credentials'});
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: req.user.role
    };
    res.send({status: 'error', error: 'Login failed'});
});

router.get('/github', passport.authenticate('github', {scope:['user:email']}), async (req,res) => {
    res.send({status: 'success', mesagge: 'User register'});
});

router.get('/github-callback', passport.authenticate('github', {failureRedirect: 'login'}), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) return res.status(500).send({status: 'error', error: 'Logout failed'});
        res.redirect('/');
    });
});

export default router;
