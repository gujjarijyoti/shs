frappe.ui.form.on('Sales Order', {
	refresh(frm) {
		var items = frm.doc.items;
    //console.log("items....."+JSON.stringify(items));
    for (var i = 0; i < items.length; i++) {
        var item_code = items[i]['item_code'];
        var pch_sort_order_item_master = null;
       pch_sort_order_item_master = fetch_pch_sort_order(item_code);
        console.log("pch_sort_order_item_master", pch_sort_order_item_master);
        items[i]['pch_sort_order']=pch_sort_order_item_master;// your code here
	}
	}
});

frappe.ui.form.on('Sales Order Item', {
	pch_qty_nos: function(frm, cdt, cdn) {
        console.log("-----------");
        //cur_frm.refresh_field("items")
        var d = locals[cdt][cdn];
        var item_code = d.item_code;

        var pch_qty_nos = d.pch_qty_nos;
        console.log("pch_qty_nos----------------" + pch_qty_nos);

        var pch_qty_from_item_master = null;
        pch_qty_from_item_master = fetch_pch_qty_nos_cf(item_code);
        console.log("pch_qty_from_item_master", pch_qty_from_item_master);
        var qty=pch_qty_nos*pch_qty_from_item_master;
        console.log("qty",qty);
       d.qty=qty;

      var item_present_in_which_group=fetch_item_group(item_code);
      console.log("item_present_in_which_group",item_present_in_which_group);
       
/*if(item_present_in_which_group=="Sheets"){
var df = frappe.meta.get_docfield("Sales Order Item", "pch_qty_nos", cur_frm.doc.name);

        df.read_only = 1;
cur_frm.refresh_field("items");
}*/
        cur_frm.refresh_field("items");
    }


});

function fetch_pch_qty_nos_cf(item_code) {
    console.log("entered into function");
    var pch_qty_nos_cf = "";
    frappe.call({
        method: 'frappe.client.get_value',
        args: {
            'doctype': 'Item',
            'fieldname': 'pch_qty_nos_cf',

            'filters': {
                item_code: item_code,
            }
        },
        async: false,
        callback: function(r) {
            if (r.message) {
                pch_qty_nos_cf = r.message.pch_qty_nos_cf;
                console.log(pch_qty_nos_cf);
                console.log("readings-----------" + JSON.stringify(r.message));

            }
        }
    });
    return pch_qty_nos_cf;
}
function fetch_pch_sort_order(item_code) {
    console.log("entered into function");
    var pch_sort_order = "";
    frappe.call({
        method: 'frappe.client.get_value',
        args: {
            'doctype': 'Item',
            'fieldname': 'pch_sort_order',

            'filters': {
                item_code: item_code,
            }
        },
        async: false,
        callback: function(r) {
            if (r.message) {
                pch_sort_order = r.message.pch_sort_order;
                console.log(pch_sort_order);
                console.log("readings-----------" + JSON.stringify(r.message));

            }
        }
    });
    return pch_sort_order;
}

function fetch_item_group(item_code) {
    console.log("entered into function");
    var item_group = "";
    frappe.call({
        method: 'frappe.client.get_value',
        args: {
            'doctype': 'Item',
            'fieldname': 'item_group',

            'filters': {
                item_code: item_code,
            }
        },
        async: false,
        callback: function(r) {
            if (r.message) {
                item_group = r.message.item_group;
                console.log(item_group);
                console.log("readings-----------" + JSON.stringify(r.message));

            }
        }
    });
    return item_group;
}
