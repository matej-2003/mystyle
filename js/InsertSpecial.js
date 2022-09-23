class InsertSpecial {
	constructor(oninsert) {
		this.search            = $('<input>').attr({'type': 'search'});
		this.font              = $('<select>');
		this.subset            = $('<select>');
		this.symbol_list       = $('<div></div>').addClass('symbol_list');
		this.selected_symbol    = $('<div></div>').addClass('selected_symbol');
		this.symbol_info       = $('<span></span>');
		this.hexadecimal_input = $('<input>').attr({'type': 'text'});
		this.decimal_input     = $('<input>').attr({'type': 'number'});
		this.favorite_btn      = $('<button>Favorite</button>').addClass('btn');
		this.recent_list       = [];
		this.recent            = $('<div></div>').addClass('symbol_list');
		this.favorite_list     = [];
		this.favorite          = $('<div></div>').addClass('symbol_list');
		this.cancel_btn        = $('<button>Cancel</button>').addClass('btn');
		this.insert_btn        = $('<button>Insert</button>').addClass('btn');
		this.symbol_data       = {};
		this.data_loded        = false;
		this.selected_data     = [];
		this.all = [
			[8216, "Left single quotation mark"]
		];

		this.html = $('<div></div>').addClass('insert_symbol').append(
			$('<div></div>').addClass('toolbar').append(
				$('<table></table>').append(
					$('<tr></tr>').append(
						$('<td></td>').text('Search'),
						$('<td></td>').text('Font'),
						$('<td></td>').text('Subset'),
					),
					$('<tr></tr>').append(
						$('<td></td>').append(this.search),
						$('<td></td>').append(this.font),
						$('<td></td>').append(this.subset),
					),
				),
			),
			$('<div></div>').addClass('selector').append(
				this.symbol_list,
				$('<div></div>').addClass('preview').append(
					this.selected_symbol,
					this.symbol_info,
					$('<table></table>').append(
						$('<tr></tr>').append(
							$('<td></td>').text('Hexadecimal'),
							$('<td></td>').append(this.hexadecimal_input),
						),
						$('<tr></tr>').append(
							$('<td></td>').text('Decimal'),
							$('<td></td>').append(this.decimal_input),
						),
						$('<tr></tr>').append(
							$('<td></td>').attr({'colspan': 2}).append(this.favorite_btn),
						),
					),
				),
			),
			$('<div></div>').addClass('other').append(
				$('<table></table>').append(
					$('<tr></tr>').append(
						$('<td></td>').text('Recent:'),
						$('<td></td>').append(this.recent),
					),
					$('<tr></tr>').append(
						$('<td></td>').text('Favorite:'),
						$('<td></td>').append(this.favorite),
					)
				),
				$('<br>'),
				$('<div></div>').addClass('buttons').append(this.cancel_btn, this.insert_btn),
			),
		);

		let fonts = ['Blackadder ITC', 'Agency FB', 'Bauhaus 93'];
		for (let font of fonts) {
			this.font.append($(`<option>${font}</option>`));
		}

		$.getJSON('/js/symbols.json', (data) => {
			this.symbol_data = data;
			for (let subset of Object.keys(this.symbol_data)) {
				this.subset.append($(`<option>${subset}</option>`).val(subset));
			}
			this.load_symbols(this.symbol_data['general']);
		});

		this.insert_btn.click(() => {
			if (oninsert) oninsert();
		});

		this.subset.change(() => {
			this.load_symbols(this.symbol_data[this.subset.val()]);
		});

		this.favorite_btn.click(() => {
			let [n, info] = this.selected_data;
			if (this.favorite_list.length >= 2) {
				if (this.favorite_list[0][0] != n) this.favorite_list.unshift([n, info]);
			} else this.favorite_list.unshift([n, info]);
			if (this.favorite_list.length >= 10) this.favorite_list.pop();

			this.favorite.html('');
			for (let [n, info] of this.favorite_list) this.favorite.append(this.create_symbol(n, info))
		});

		this.search.change(() => {
			let sq = this.search.val();
			if (sq) {
				let results = this.all.filter(([n, info]) => info.toLowerCase().includes(sq));
				this.load_symbols(results);
				console.log(results);
			} else this.symbol_list.html('');
		});
	}

	create_symbol(n, info) {
		return $('<div></div>').addClass('symbol').attr({'title': info}).html(`&#${n};`).click(() => this.show_preview(n, info));
	}

	load_symbols(symbol_list) {
		this.symbol_list.html('');
		for (let [n, info] of symbol_list)
			this.symbol_list.append(this.create_symbol(n, info));
	}

	add_recent(n, info) {
		if (this.recent_list.length >= 2) {
			if (this.recent_list[0][0] != n) this.recent_list.unshift([n, info]);
		} else this.recent_list.unshift([n, info]);
		if (this.recent_list.length >= 10) this.recent_list.pop();
		
		this.recent.html('');
		for (let [n, info] of this.recent_list) this.recent.append(this.create_symbol(n, info))
	}

	show_preview(n, info) {
		this.symbol_info.text(info);
		this.decimal_input.val(n);
		this.hexadecimal_input.val(n.toString(16));
		this.selected_symbol.html(`&#${n};`);
		this.add_recent(n, info);
		this.selected_data = [n, info];
	}

	reset() {
		this.search.val('');
		this.hexadecimal_input.val('');
		this.decimal_input.val('');
		this.selected_data = [];
		this.selected_symbol.html('');
		this.symbol_list.html('');
		this.recent.html('');
		this.favorite.html('');
	}

	get_symbol() {
		return `&#${this.selected_data[0]};`;
	}
}