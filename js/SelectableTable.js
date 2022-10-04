class Row {
	constructor(row, checkbox) {
		this.row      = row;
		this.checkbox = checkbox;
		this.on_click = null;
		
		if (this.checkbox.prop('checked')) this.row.toggleClass('selected');

		this.checkbox.click(() => {
			this.toggle_checkbox();
			if (this.checkbox.prop('checked')) this.row.addClass('selected');
			else this.row.removeClass('selected');
			if (this.on_click) this.on_click();
		});

		this.row.click(() => {
			if (this.checkbox) {
				this.toggle_checkbox();
				if (this.on_click) this.on_click();
			}
			this.row.toggleClass('selected');
		});
	}

	toggle_checkbox() {
		this.checkbox.prop('checked', this.checkbox.prop('checked'));
	}

	toggle() {
		this.toggle_checkbox();
		this.row.toggleClass('selected');
	}

	clear() {
		this.checkbox.prop('checked', false);
		this.row.removeClass('selected');
	}

	set(condition) {
		if (this.checkbox) this.checkbox.prop('checked', condition);
		if (condition) this.row.addClass('selected');
		else this.row.removeClass('selected');
	}
}

class SelectableTable {
	constructor(data=[], make_row=null, on_click=null, on_all=null, on_toggle=null, on_clear=null, toolbar=true) {
		this.table       = $('<table></table>').attr({'class': 'selectable'});
		this.all         = $('<input>').attr({'type': 'checkbox' });
		this.all_link    = $('<a>all</a>').attr({'href': '#' });
		this.toggle      = $('<input>').attr({'type': 'checkbox' });
		this.toggle_link = $('<a>toggle</a>').attr({'href': '#' });
		this.clear_link  = $('<a>clear</a>').attr({'href': '#' });
		this.toolbar     = $('<div></div>');
		this.on_all      = on_all;
		this.on_toggle   = on_toggle;
		this.on_clear    = on_clear;
		this.rows        = [];

		this.toolbar.append(this.all, this.all_link, ' | ', this.toggle, this.toggle_link, ' | ', this.clear_link,);


		this.all.click(() => this.all_(this.all.checked));

		this.all_link.click(() => {
			this.all.checked = !this.all.checked;
			this.all_(this.all.checked);
		});

		this.toggle.click(() => this.toggle_());

		this.toggle_link.click(() => {
			this.toggle.checked = !this.toggle.checked;
			this.toggle_();
		});

		this.clear_link.click(() => this.clear_());

		if (toolbar) {
			this.table.append(
				$('<tr></tr>').addClass('toolbar').append(
					$('<td></td>').attr({"colspan": "100"}).append(this.toolbar),
				)
			);
		} else {
			let toolbar_ = $(`.toolbar[for=${this.table.id}]`);
			if (toolbar_) toolbar_.append(this.toolbar);
		}

		for (let datum of data) {
			let row = make_row(datum, on_click);
			row.on_click = on_click;
			this.rows.push(row);
			this.table.append(row.row);
		}
	}

	all_(condition) {
		this.toggle.toggle(false);
		for (let row of this.rows) {
			row.set(condition);
		}
		if (this.on_all) this.on_all();
	}

	toggle_() {
		this.all.toggle(false);
		for (let row of this.rows) {
			row.toggle();
		}
		if (this.on_toggle) this.on_toggle();
	}

	clear_() {
		this.all.toggle(false);
		this.toggle.toggle(false);
		for (let row of this.rows) {
			row.clear();
		}
		if (this.on_clear) this.on_clear();
	}
}

/*
function load_s_table(s_table) {
	let rows = s_table.querySelectorAll('tr:not(.toolbar)');
	let all = ce('input', { 'type': 'checkbox' });
	let all_link = ce('a', { 'href': '#' });
	all_link.innerText = 'all';
	let toggle = ce('input', { 'type': 'checkbox' });
	let toggle_link = ce('a', { 'href': '#' });
	toggle_link.innerText = 'toggle';
	let clear_link = ce('a', { 'href': '#' });
	clear_link.innerText = 'clear';

	all.addEventListener('click', () => {
		all_(all.checked);
	});

	all_link.addEventListener('click', () => {
		all.checked = !all.checked;
		all_(all.checked);
	});

	toggle.addEventListener('click', () => {
		toggle_();
	});

	toggle_link.addEventListener('click', () => {
		toggle.checked = !toggle.checked;
		toggle_();
	});

	clear_link.addEventListener('click', () => {
		clear_();
	});

	function all_(condition) {
		for (let row of rows) {
			let chk = row.querySelector('input[type=checkbox]');
			if (chk) chk.checked = condition;
			if (condition) row.classList.add('selected');
			else row.classList.remove('selected');
		}
		toggle.checked = false;
	}

	function toggle_() {
		for (let row of rows) {
			let chk = row.querySelector('input[type=checkbox]');
			if (chk) chk.checked = !chk.checked;
			row.classList.toggle('selected');
		}
		all.checked = false;
	}

	function clear_() {
		all.checked = false;
		toggle.checked = false;
		for (let row of rows) {
			let chk = row.querySelector('input[type=checkbox]');
			if (chk) chk.checked = false;
			row.classList.remove('selected');
		}
	}

	if (s_table.classList.contains('toolbar')) {
		let tr = s_table.insertRow(0);
		tr.classList.add('toolbar');
		let td = tr.insertCell(0);
		td.setAttribute("colspan", "100");

		td.append(
			all, all_link,
			' | ',
			toggle, toggle_link,
			' | ',
			clear_link,
		);
	} else {
		let toolbar = $(`.toolbar[for=${s_table.id}]`);
		if (toolbar) {
			toolbar.append(
				all, all_link,
				' | ',
				toggle, toggle_link,
				' | ',
				clear_link,
			);
		}
	}

	for (let row of rows) {
		let chk = row.querySelector('input[type=checkbox]');
		if (chk) {
			if (chk.checked) row.classList.toggle('selected');
			chk.addEventListener('click', () => {
				chk.checked = !chk.checked;
				if (chk.checked) row.classList.add('selected');
				else row.classList.remove('selected');
			});
		}
		row.addEventListener('click', () => {
			if (chk) {
				chk.checked = !chk.checked;
			}
			row.classList.toggle('selected');
		});

	}
}

let s_tables = $$('table.selectable');
for (let st of s_tables) {
	load_s_table(st);
}
*/