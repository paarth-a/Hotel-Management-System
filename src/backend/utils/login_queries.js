const loginQuery =
    `
        SELECT * from _USER where user_email = ? AND is_user = ?
    `;

const registerQuery =
    `
        INSERT INTO _USER SET ?
    `;

module.exports = {loginQuery, registerQuery};
