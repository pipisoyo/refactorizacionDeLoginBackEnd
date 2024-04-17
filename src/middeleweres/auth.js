export function auth(req, res, next) {

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }
    next();
}

export function authUser(req, res, next) {
    
    const requestedCartId = req.params.cid;

    if (req.session.user.role === 'admin') {
        next();
    } else if (req.session.user.cartId === requestedCartId) {
        next();
    } else {
        return res.status(403).send({ status: "error", error: "Acceso denegado" });
    }
}
