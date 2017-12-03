const uuidv4 = require('uuid/v4');

var fields_reducers = {
	"id_utilisateur": (value) => value.length > 0,
	"quantite": (value) => value > -1,
};


var CommandeModel = function(params) {
	this.produit = params.produit || "";
	this.id_commande = params.id_commande || uuidv4();
	this.id_utilisateur = params.id_utilisateur || "";
	this.quantite = params.quantite || 0;
	this.valid = params.valid || false;

}

CommandeModel.prototype.create = function() {

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


module.exports = CommandeModel;
