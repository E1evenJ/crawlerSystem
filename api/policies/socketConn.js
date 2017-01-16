/**
 * Created by jiangyun on 2016/12/15.
 */
module.exports = function (req, res, next) {
    // Make sure this is a socket request (not traditional HTTP)
    if (!req.isSocket) {
        return res.badRequest();
    } else {
        next();
    }
};
