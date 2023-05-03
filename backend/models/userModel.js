module.exports = (sequelize, Sequelize) => {
    return sequelize.define("user", {
        _id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING,
            is: /^[0-9a-f]{64}$/i
        },
        isAdmin: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        isLocked: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    },
    {   instanceMethods: {
            matchPassword : async function(enteredPassword) {
                return await bcrypt.compare(enteredPassword, this.password)
            }
        }
    });
};
