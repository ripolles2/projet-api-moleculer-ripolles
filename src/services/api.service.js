"use strict";

const ApiGateway = require("moleculer-web");


module.exports = {
	name: "api",
	mixins: [ ApiGateway],

	settings: {
		port: process.env.PORT || 9000,

        cors: {
            // Configures the Access-Control-Allow-Origin CORS header.
            origin: "*",
            // Configures the Access-Control-Allow-Methods CORS header.
            methods: ["GET", "PATCH", "POST"],
            // Configures the Access-Control-Allow-Headers CORS header.
            allowedHeaders: ["Content-Type"],
            // Configures the Access-Control-Expose-Headers CORS header.
            exposedHeaders: [],
            // Configures the Access-Control-Allow-Credentials CORS header.
            credentials: false,
            // Configures the Access-Control-Max-Age CORS header.
            maxAge: 3600
        },

		routes: [

			{
				path: "/api/v1",
				whitelist: [
					// Access to any actions in all services
					"*"
				],
				aliases: {
					// The `name` comes from named param.
					// You can access it with `ctx.params.name` in action
					// "GET hi/:name": "greeter.welcome",
					// "POST user/:auth0_id": "user.create",
					"POST user": "utilisateur.create",
					"GET user/:email": "utilisateur.get",
					"PATCH user/:email": "utilisateur.edit",
					"POST product": "produit.create",
					"GET product/:id_produit": "produit.get",
					"PATCH product/:id_produit": "produit.edit",
					"PATCH product/:id_produit/increment": "produit.increment",
					"PATCH product/:id_produit/decrement": "produit.decrement",
					"POST order/user/:id_utilisateur" : "commande.create",
					"GET order/:id_commande": "commande.get",
					"GET order/user/:id_utilisateur": "commande.getComUti",
					"PATCH order/:id_commande/product/:id_produit/increment": "commande.increment",
					"PATCH order/:id_commande/product/:id_produit/decrement": "commande.decrement",
					"PATCH order/:id_commande": "commande.validation"
					
					
				}
			},
			

			{
				bodyParsers: {
	                json: true,
	            },
				path: "/client/",
				whitelist: [
					// Access to any actions in all services
					"*"
				],
				aliases: {
					//	Example project
				}
			}
		]

	}
};
