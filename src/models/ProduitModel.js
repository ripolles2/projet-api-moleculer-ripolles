const uuidv4 = require('uuid/v4');

var fields_reducers = {

	"titre" : (value) => value.length >0,
	"description": (value) => value.length >0,
	"prix": (value) => value > -1,
	"stock": (value) => value > -1,

	
};

var ProduitModel = function(params) {
	this.id_produit = params.id_produit || uuidv4();
	this.titre = params.titre || "";
	this.description = params.description || "";
	this.prix = params.prix || 0;
	this.stock = params.stock || 0;
	}
	
	
	
ProduitModel.prototype.create = function() {

	var valid = true;

	var keys = Object.keys(fields_reducers);

	for (var i = 0; i < keys.length; i++)
	{
		if ( typeof this[keys[i]] != typeof undefined ) {
			if ( !fields_reducers[keys[i]](this[keys[i]]) )
			{
				valid = false;
			}
		}
		else
		{
			valid = false;
		}
	}

	if (valid) {
		return this;
	} else {
		return undefined;
	}
}

module.exports = ProduitModel;