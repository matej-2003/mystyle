function $(e) {
    return document.querySelector(e);
}

function $$(e) {
    return document.querySelectorAll(e);
}

function ce(tag, properties) {
    if (properties && typeof (properties) == "object") {
        let tmp = document.createElement(tag);
        for (let key in properties) {
            switch (key) {
                case "class":
                    tmp.classList.value = properties[key];
                    // let classes = properties[key].split(' ');
                    // for (let c of classes) {
                    //     tmp.classList.add(c);
                    // }
                    break;
                default:
                    tmp.setAttribute(key, properties[key]);
                    break;
            }
        }
        return tmp;
    } else {
        return document.createElement(tag);
    }
}

function unpack_element(packed_e, return_e = null) {
    if (return_e == null) return_e = ce(packed_e['tag']);
    if ('id' in packed_e) {
        if (packed_e['id'] != '') return_e.id = packed_e['id'];
    }
    //if ('name' in packed_e) return_e.name = packed_e['name'];
    if ('data' in packed_e) {
        for (let data of packed_e['data']) {
            if (typeof (data) == 'string') {
                return_e.appendChild(document.createTextNode(data));
            } else if (typeof (data) == 'object') {
                return_e.appendChild(unpack_element(data));
            }
        }
    }
    if ('class' in packed_e) {
        for (let c of packed_e['class']) {
            if (c != '') return_e.classList.add(c);
        }
    }
    if ('style' in packed_e) {
        for (let s in packed_e['style']) return_e.style[s] = packed_e['style'][s];
    }
    if ('attributes' in packed_e) {
        for (let a in packed_e['attributes']) return_e.setAttribute(a, packed_e['attributes'][a]);
    }
    return return_e;
}

function pack_element(e) {
    let element_packed = {
        'tag': e.tagName,
        // 'id': e.id,
        'data': [],
        //'class': [],
        'style': {},
        'attributes': {},
    }
    if (!!e.id) element_packed['id'] = e.id;
    if (!!e.classList.value) element_packed['class'] = e.classList.value.split(' ');
    //for (let cls of e.classList) {element_packed['class'].push(cls);
    for (let s in e.style) {
        if (!!e.style[s] && (typeof (e.style[s]) == "number" || typeof (e.style[s]) == "string")) {
            element_packed['style'][s] = e.style[s];
        }
    }
    delete element_packed['style']['0'];
    delete element_packed['style']['cssText'];
    delete element_packed['style']['length'];
    for (let a of e.attributes) {
        if (!['id', 'class', 'style'].includes(a.name)) {
            element_packed['attributes'][a.name] = e.getAttribute(a.name);
        }
    }
    for (let c of e.childNodes) {
        if (c instanceof Text) {
            if (!!c.data) element_packed['data'].push(c.data);
        } else {
            element_packed['data'].push(pack_element(c));
        }
    }

    // if (!!element_packed['id']) delete element_packed['id'];
    // if (element_packed['class'].length == 0) delete element_packed['class'];
    if (element_packed['data'].length == 0) delete element_packed['data'];
    if (Object.keys(element_packed['style']).length == 0) delete element_packed['style'];
    if (Object.keys(element_packed['attributes']).length == 0) delete element_packed['attributes'];

    return element_packed;
}



// DO THIS LATER
// hours_wasted_counter = 5

let tables = document.querySelectorAll('table');

for (let i of tables) {
    let trs = i.querySelectorAll('tr');
    let toggle = document.querySelector(`[toggle=${i.id}]`);
    console.log(toggle);
    let all = i.querySelector('[all]');

    for (let j of trs) {
        let checkbox = j.querySelector('input[type=checkbox]');
        if (checkbox) {
            // checkbox.onchange = function() {
            //     if (j.classList['selected']) {
            //         j.classList.remove('selected');
            //     } else {
            //         j.classList.add('selected');
            //     }
            // }
            // if (checkbox && !checkbox.disabled) {
            j.onclick = function (event) {
                if (event.target != checkbox) {
                    // if (checkbox.checked) {
                    //     j.classList.remove('selected');
                    // } else {
                    //     j.classList.add('selected');
                    // }
                    checkbox.checked = !checkbox.checked;
                }
            }
        }
    }

    if (toggle && all) {
        toggle.onclick = function () {
            for (let u of trs) {
                chk = u.querySelector('input[type=checkbox]');
                chk.checked = !chk.checked;
            }
            all.checked = false;
        }

        all.onclick = function () {
            toggle.checked = false;
            for (let u of trs) {
                chk = u.querySelector('input[type=checkbox]');
                chk.checked = all.checked;
            }
        }
    }
}

// let user_selection = document.querySelectorAll('.user_selection');
// let toggle = document.querySelector('#toggle');
// let all = document.querySelector('#all');

// for (let u of user_selection) {
//     u.onclick = function () {
//         if ((!u.checked) && all.checked) {
//             all.checked = false;
//         }
//     }
// }


let data_rows = document.querySelectorAll('tr.data_row');
for (let row of data_rows) {
	let check_box = row.querySelector('input[type=checkbox');
	let chk_td = check_box.parentElement;
	let td_list = row.querySelectorAll('td');

	for (let td of td_list) {
		if(td != chk_td) td.onclick = () => {window.location.href = row.dataset['link'];};
	}

	chk_td.onclick = () => {
		check_box.checked = !check_box.checked;
	};

	check_box.onclick = () => {
		check_box.checked = !check_box.checked;
	};
}