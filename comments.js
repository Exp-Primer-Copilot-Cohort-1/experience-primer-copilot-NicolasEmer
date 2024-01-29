// Create web server
var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');
var User = require('../models/user');
var Post = require('../models/post');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('../config/database');

// Add comment
router.post('/add', function(req, res, next) {
    var token = req.body.token || req.body.query || req.headers['x-access-token'];
    if (token) {
        // Verify token
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                res.json({ success: false, message: 'Token invalid!' });
            } else {
                // Check user id
                if (!req.body.userId) {
                    res.json({ success: false, message: 'No user id provided!' });
                } else {
                    // Check post id
                    if (!req.body.postId) {
                        res.json({ success: false, message: 'No post id provided!' });
                    } else {
                        // Check comment
                        if (!req.body.comment) {
                            res.json({ success: false, message: 'No comment provided!' });
                        } else {
                            // Create new comment
                            var comment = new Comment({
                                userId: req.body.userId,
                                postId: req.body.postId,
                                comment: req.body.comment,
                                created: new Date()
                            });
                            // Save comment
                            comment.save(function(err) {
                                if (err) {
                                    res.json({ success: false, message: 'Comment not saved!' });
                                } else {
                                    res.json({ success: true, message: 'Comment saved!' });
                                }
                            });
                        }
                    }
                }
            }
        });
    } else {
        res.json({ success: false, message: 'No token provided!' });
    }
});

// Get comments
router.get('/get/:id', function(req, res, next) {
    // Check post id
    if (!req.params.id) {
        res.json({ success: false, message: 'No post id provided!' });
    } else {
        // Find comments by post id
        Comment.find({ postId: req.params.id }, function(err, comments) {
            if (err) {
                res.json({ success: false, message: 'Invalid post id!' });
            } else {
                // Check comments
                if (!comments) {
                    res.json({ success: false, message: 'No comments found!' }); // Return error message if comments not found
                }
                else {
                    res.json({ success: true, comments: comments }); // Return comments if found
                }
            }
        }
        ).sort({ '_id': -1 }); // Sort comments from newest to oldest
    }
}
);