'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('configurations', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            product: {
                type: Sequelize.STRING
            },
            installationType: {
                type: Sequelize.STRING
            },
            dimensions: {
                type: Sequelize.JSON
            },
            color: {
                type: Sequelize.STRING
            },
            led: {
                type: Sequelize.STRING
            },
            service: {
                type: Sequelize.BOOLEAN
            },
            branch: {
                type: Sequelize.STRING
            },
            name: {
                type: Sequelize.STRING
            },
            email: {
                type: Sequelize.STRING
            },
            phone: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('configurations');
    }
};