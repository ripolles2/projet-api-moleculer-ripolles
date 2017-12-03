"use strict";

const Database = require("../adapters/Database");
const Models = require("../models");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
	name: "commande",

	settings: {
 		state: {

 		}
	},

	actions: {

		//	call "todos.create" --name "Name"
		create: {
			params: {
				id_utilisateur: "string"
			},
			handler(ctx) {
				var commande = new Models.Commande(ctx.params).create();
				console.log("Commande - create - ", commande);
				if (commande) {
					return Database()
						.then((db) => {
							return db.get("commande")
								.push(commande)
								.write()
								.then(() => {
									return commande;
								})
								.catch(() => {
									return new MoleculerError("Commande", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
								});
					});
				} else {
					return new MoleculerError("Commande", 417, "ERR_CRITIAL", { code: 417, message: "Commande is not valid" } )
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
						return db.get("commande").value();
					});
			}
		},


		//	call "todo.get" --id_todo
		get: {
			params: {
				id_commande: "string"
			},
			handler(ctx) {
				return ctx.call("commande.verify", { id_commande: ctx.params.id_commande })
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var commande = db.get("commande").find({ id_commande: ctx.params.id_commande }).value();;
								return commande;
							})
							.catch(() => {
								return new MoleculerError("Commande", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("Commande", 404, "ERR_CRITIAL", { code: 404, message: "Commande doesn't exists" } )
					}
				})
			}
		},

		getComUti: {
			params: {
				id_utilisateur: "string"
			},
			handler(ctx) {
						var tab_id = [];
						var k;
						return Database()
							.then((db) => {
								var commande = db.get("commande").filter({id_utilisateur: ctx.params.id_utilisateur}).value();
								for(k = 0; k < commande.length; k++){
									tab_id[k] = commande[k].id_commande;
								}
								return tab_id;
							})
							.catch(() => {
								return new MoleculerError("Commande", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					}
				},
			
		



		//	call "todos.verify" --id_todo
		verify: {
			params: {
				id_commande: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("commande")
										.filter({ id_commande: ctx.params.id_commande })
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},

		//	call "todos.edit" --id_todo  --name --completed
		edit: {
			params: {
				id_todo: "string",
				name: "string",
				completed: "boolean"
			},
			handler(ctx) {
				return ctx.call("todos.get", { id_todo: ctx.params.id_todo })
						.then((db_todo) => {
							//
							var todo = new Models.Todo(db_todo).create();
							todo.name = ctx.params.name || db_todo.name;
							todo.completed = ctx.params.completed || false;
							//
							return Database()
								.then((db) => {
									return db.get("todos")
										.find({ id: ctx.params.id_todo })
										.assign(todo)
										.write()
										.then(() => {
											return todo;
										})
										.catch(() => {
											return new MoleculerError("Todos", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
										});
								})
						})
			}
		},

		increment: {
			params: {
				id_commande:"string",
				id_produit: "string"
			},
			handler(ctx) {
				return ctx.call("commande.verify", { id_commande: ctx.params.id_commande })
				.then((exists) => {
					if (exists) {
							return ctx.call("produit.verify", {id_produit: ctx.params.id_produit})
							.then((exists1) => {
								if(exists1) {
									return ctx.call("commande.get", { id_commande: ctx.params.id_commande })
						.then((db_commande) => {
							//
							var commande = new Models.Commande(db_commande).create();
							commande.produit = ctx.params.id_produit;
							commande.id_utilisateur = db_commande.id_utilisateur;
							commande.quantite = db_commande.quantite + 1;
							commande.valid = db_commande.valid;
							//
							return Database()
								.then((db) => {
									return db.get("commande")
										.find({ id_commande: ctx.params.id_commande })
										.assign(commande)
										.write()
										.then(() => {
											return commande;
										})
										.catch(() => {
											return new MoleculerError("Commande", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
										});
								})
						})
							.catch(() => {
								return new MoleculerError("Commande", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});

								}
								else{
									return new MoleculerError("produit", 404, "ERR_CRITIAL", { code: 404, message: "Produit doesn't exists" } )
								}
							}



								)
							
					} else {
						return new MoleculerError("Commande", 404, "ERR_CRITIAL", { code: 404, message: "Commande doesn't exists" } )
					}
				})
			}
		},


		decrement: {
			params: {
				id_commande:"string",
				id_produit: "string"
			},
			handler(ctx) {
				return ctx.call("commande.verify", { id_commande: ctx.params.id_commande })
				.then((exists) => {
					if (exists) {
							return ctx.call("produit.verify", {id_produit: ctx.params.id_produit})
							.then((exists1) => {
								if(exists1) {
									return ctx.call("commande.get", { id_commande: ctx.params.id_commande })
						.then((db_commande) => {
							//
							var commande = new Models.Commande(db_commande).create();
							commande.produit = ctx.params.id_produit;
							commande.id_utilisateur = db_commande.id_utilisateur;
							if(db_commande.quantite - 1 > 0){
								commande.quantite = db_commande.quantite - 1;
							}
							else {
								commande.quantite = 0;
							}
							commande.valid = db_commande.valid;
							//
							return Database()
								.then((db) => {
									return db.get("commande")
										.find({ id_commande: ctx.params.id_commande })
										.assign(commande)
										.write()
										.then(() => {
											return commande;
										})
										.catch(() => {
											return new MoleculerError("Commande", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
										});
								})
						})
							.catch(() => {
								return new MoleculerError("Commande", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});

								}
								else{
									return new MoleculerError("produit", 404, "ERR_CRITIAL", { code: 404, message: "Produit doesn't exists" } )
								}
							}



								)
							
					} else {
						return new MoleculerError("Commande", 404, "ERR_CRITIAL", { code: 404, message: "Commande doesn't exists" } )
					}
				})
			}
		},

		validation: {
			params: {
				id_commande:"string",
			},
			handler(ctx) {
				return ctx.call("commande.verify", { id_commande: ctx.params.id_commande })
				.then((exists) => {
					if (exists) {
							return ctx.call("commande.get", { id_commande: ctx.params.id_commande })
						.then((db_commande) => {
							//
							var commande = new Models.Commande(db_commande).create();
							commande.produit = db_commande.produit;
							commande.id_utilisateur = db_commande.id_utilisateur;
							commande.quantite = db_commande.quantite;
							if (!db_commande.valid) {
								commande.valid = !db_commande.valid;
							}
							else {
								commande.valid = db_commande.valid;
							}
														//
							return Database()
								.then((db) => {
									return db.get("commande")
										.find({ id_commande: ctx.params.id_commande })
										.assign(commande)
										.write()
										.then(() => {
											return commande;
										})
										.catch(() => {
											return new MoleculerError("Commande", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
										});
								})
						})
							.catch(() => {
								return new MoleculerError("Commande", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("Commande", 404, "ERR_CRITIAL", { code: 404, message: "Commande doesn't exists" } )
					}
				})
			}
		}





	}
};