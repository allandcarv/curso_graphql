const jwt = require('jwt-simple');

module.exports = async ({ req }) => {
    // Em desenvolvimento
    await require('./simularUsuarioLogado')(req);
    const auth = req.headers.authorization;
    const [, token] = auth && auth.split(' ');

    let usuario = null;
    let admin = false;

    if (token) {
        try {
            let conteudoToken = jwt.decode(token, process.env.AUTH_SECRET);

            if (new Date(conteudoToken.exp * 1000) > new Date()) {
                usuario = conteudoToken
            }
        } catch (error) {
            // token inválido

        }
    }

    if (usuario && usuario.perfis) {
        admin = usuario.perfis.includes('admin');
    }

    const err = new Error('Acesso Negado');

    return {
        usuario,
        admin,
        validarUsuario() {
            if (!usuario) throw err;
        },
        validaAdmin() {
            if (!admin) throw err;
        }
    }
}