"use strict";

const Database = require("../adapters/Database");
const Models = require("../models");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
	name: "produit",

	settings: {
 		state: {

 		}
	},

	actions: {

		create: {
			params: {
				titre: "string",
				description:"string",
				prix: "number"
			},
			handler(ctx) {
				console.log(ctx.params);
				var produit = new Models.Produit(ctx.params).create();
				console.log("Produit - create - ", produit);
				if (produit) {
					return Database()
						.then((db) => {
							var tous_les_produits = db.get("produit");
							if(tous_les_produits.find({"titre": produit.titre}).value()){
								return new MoleculerError("Produit", 409, "ERR_CRITIAL", { code: 409, message: "Produit existe déjà" } )
							}


							return tous_les_produits
								.push(produit)
								.write()
								.then(() => {
									return produit;
								})
								.catch(() => {
									return new MoleculerError("Produit", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
								});
							
						

					});
					

				} else {
					return new MoleculerError("Produit", 417, "ERR_CRITIAL", { code: 417, message: "Produit is not valid" } )
				}
			}
		},

		
		getAll: {
			params: {

			},
			handler(ctx) {
				return Database()
					.then((db) => {
						return db.get("produit").value();
					});
			}
		},


		get: {
			params: {
				id_produit: "string"
			},
			handler(ctx) {
				return ctx.call("produit.verify", { id_produit: ctx.params.id_produit })
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var produit = db.get("produit").find({ id_produit: ctx.params.id_produit }).value();;
								return produit;
							})
							.catch(() => {
								return new MoleculerError("Produit", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("Produit", 404, "ERR_CRITIAL", { code: 404, message: "Produit doesn't exists" } )
					}
				})
			}
		},

		
		verify: {
			params: {
				id_produit: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("produit")
										.filter({ id_produit: ctx.params.id_produit })
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},

		increment: {
			params: {
				id_produit: "string"
			},
			handler(ctx) {
				return ctx.call("produit.verify", { id_produit: ctx.params.id_produit })
				.then((exists) => {
					if (exists) {
							return ctx.call("produit.get", { id_produit: ctx.params.id_produit })
						.then((db_produit) => {
							//
							var produit = new Models.Produit(db_produit).create();
							produit.titre = db_produit.titre;
							produit.description = db_produit.description;
							produit.prix = db_produit.prix;
							produit.stock = db_produit.stock + 1;
							//
							return Database()
								.then((db) => {
									return db.get("produit")
										.find({ id_produit: ctx.params.id_produit })
										.assign(produit)
										.write()
										.then(() => {
											return produit.id_produit;
										})
										.catch(() => {
											return new MoleculerError("Produit", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
										});
								})
						})
							.catch(() => {
								return new MoleculerError("Produit", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("Produit", 404, "ERR_CRITIAL", { code: 404, message: "Produit doesn't exists" } )
					}
				})
			}
		},

		decrement: {
			params: {
				id_produit: "string"
			},
			handler(ctx) {
				return ctx.call("produit.verify", { id_produit: ctx.params.id_produit })
				.then((exists) => {
					if (exists) {
							return ctx.call("produit.get", { id_produit: ctx.params.id_produit })
						.then((db_produit) => {
							//
							var produit = new Models.Produit(db_produit).create();
							produit.titre = db_produit.titre;
							produit.description = db_produit.description;
							produit.prix = db_produit.prix;
							if(db_produit.stock - 1 > 0){
								produit.stock = db_produit.stock - 1;
							}
							else {
								produit.stock = 0;
							}
							//
							return Database()
								.then((db) => {
									return db.get("produit")
										.find({ id_produit: ctx.params.id_produit })
										.assign(produit)
										.write()
										.then(() => {
											return produit.id_produit;
										})
										.catch(() => {
											return new MoleculerError("Produit", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
										});
								})
						})
							.catch(() => {
								return new MoleculerError("Produit", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("Produit", 404, "ERR_CRITIAL", { code: 404, message: "Produit doesn't exists" } )
					}
				})
			}
		},



		edit: {
			params: {
				id_produit: "string",
				titre: "string",
				description: "string",
				prix: "number",
				stock: "number"
			},
			handler(ctx) {
				return ctx.call("produit.verify", { id_produit: ctx.params.id_produit })
				.then((exists) => {
					if (exists) {
							return ctx.call("produit.get", { id_produit: ctx.params.id_produit })
						.then((db_produit) => {
							//
							var produit = new Models.Produit(db_produit).create();
							produit.titre = ctx.params.titre || db_produit.titre;
							produit.description = ctx.params.description || db_produit.description;
							produit.prix = ctx.params.prix || db_produit.prix;
							produit.stock = ctx.params.stock || db_produit.stock;
							//
							return Database()
								.then((db) => {
									return db.get("produit")
										.find({ id_produit: ctx.params.id_produit })
										.assign(produit)
										.write()
										.then(() => {
											return produit.id_produit;
										})
										.catch(() => {
											return new MoleculerError("Produit", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
										});
								})
						})
							.catch(() => {
								return new MoleculerError("Produit", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("Produit", 404, "ERR_CRITIAL", { code: 404, message: "Produit doesn't exists" } )
					}
				})
			}
		}



	}
};