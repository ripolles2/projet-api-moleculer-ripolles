"use strict";

const Database = require("../adapters/Database");
const Models = require("../models");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
	name: "utilisateur",

	settings: {
 		state: {

 		}
	},

	actions: {

		//	call "todos.create" --name "Name"
		create: {
			params: {
				email: "string",
				nom:"string",
				prenom:"string"
			},
			handler(ctx) {
				console.log(ctx.params);
				var utilisateur = new Models.Utilisateur(ctx.params).create();
				console.log("Utilisateur - create - ", utilisateur);
				if (utilisateur) {
					return Database()
						.then((db) => {
							var tous_les_users = db.get("utilisateur");
							if(tous_les_users.find({"email": utilisateur.email}).value()){
								return new MoleculerError("Utilisateur", 409, "ERR_CRITIAL", { code: 409, message: "Utilisateur existe déjà" } )
							}


							return tous_les_users
								.push(utilisateur)
								.write()
								.then(() => {
									return utilisateur;
								})
								.catch(() => {
									return new MoleculerError("Utilisateur", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
								});
							
						

					});
					

				} else {
					return new MoleculerError("Utilisateur", 417, "ERR_CRITIAL", { code: 417, message: "Utilisateur is not valid" } )
				}
			}
		},

		//	call "todos.getAll"
		getAll: {
			params: {

			},
			handler(ctx) {
				return Database()
					.then((db) => {
						return db.get("utilisateur").value();
					});
			}
		},


		//	call "todo.get" --id_todo
		get: {
			params: {
				email: "string"
			},
			handler(ctx) {
				return ctx.call("utilisateur.verify", { email: ctx.params.email })
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var user = db.get("utilisateur").find({ email: ctx.params.email }).value();;
								return user;
							})
							.catch(() => {
								return new MoleculerError("Utilisateur", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("Utilisateur", 404, "ERR_CRITIAL", { code: 404, message: "Utilisateur doesn't exists" } )
					}
				})
			}
		},

		//	call "todos.verify" --id_todo
		verify: {
			params: {
				email: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("utilisateur")
										.filter({ email: ctx.params.email })
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},

		//	call "todos.edit" --id_todo  --name --completed
		edit: {
			params: {
				email: "string",
				nom: "string",
				prenom:"string"
			
			},
			handler(ctx) {
				return ctx.call("utilisateur.verify", { email: ctx.params.email })
				.then((exists) => {
					if (exists) {
							return ctx.call("utilisateur.get", { email: ctx.params.email })
						.then((db_user) => {
							//
							var utilisateur = new Models.Utilisateur(db_user).create();
							utilisateur.nom = ctx.params.nom || db_user.nom;
							utilisateur.prenom = ctx.params.prenom || db_user.prenom;
							//
							return Database()
								.then((db) => {
									return db.get("utilisateur")
										.find({ email: ctx.params.email })
										.assign(utilisateur)
										.write()
										.then(() => {
											return utilisateur.email;
										})
										.catch(() => {
											return new MoleculerError("Utilisateur", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
										});
								})
						})
							.catch(() => {
								return new MoleculerError("Utilisateur", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("Utilisateur", 404, "ERR_CRITIAL", { code: 404, message: "Utilisateur doesn't exists" } )
					}
				})
			}
		}



	}
};
