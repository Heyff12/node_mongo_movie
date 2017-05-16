var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    // password: {
    //     unique: true,
    //     type: String
    // },
    password: String,
    role: {
        type: Number,
        default: 0
    }, //0:normal  1:verfied  2:professional  >10:admin  >50:super admin
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    },
});

UserSchema.pre('save', function(next) {
    var user = this;
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // console.log('user_save--------111=' + user.password);
            // console.log('user_save--------111=' + hash);
            user.password = hash;
            // console.log('user_save--------222=' + user.password);
            next();
        })
    });
    //next();
});

UserSchema.methods = {
    comparePassword: function(_password, cb) {
        // console.log('user--------111' + _password);
        // console.log('user--------111' + this.password);
        bcrypt.compare(_password, this.password, function(err, isMatch) {
            if (err) {
                return cb(err)
            }
            cb(null, isMatch)
        })
    }
}

UserSchema.statics = {
    fetch: function(cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function(id, cb) {
        return this
            .findOne({ _id: id })
            .exec(cb)
    }
}

module.exports = UserSchema
