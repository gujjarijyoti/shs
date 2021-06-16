
frappe.ui.form.on("Sales Invoice Item", {


   item_code: function(frm, cdt, cdn) {
        console.log("-----------");
        
        var d = locals[cdt][cdn];
        var item_code = d.item_code;
	var pch_sort_order_item_master = null;
       pch_sort_order_item_master = fetch_pch_sort_order(item_code);
	d.pch_sort_order=pch_sort_order_item_master;

}
});
frappe.ui.form.on('Sales Invoice', 'after_save', function(frm, cdt, cdn) {
	var d = locals[cdt][cdn];
        var shipping_address_name = frm.doc.shipping_address_name;
        console.log("shipping_address_name.....", shipping_address_name);
        var delivery_route = fetch_delivery_route(shipping_address_name);
        console.log("delivery_route.....", delivery_route);
        cur_frm.set_value("pch_delivery_route", delivery_route);
	var sorting_on_off=frm.doc.pch_sorting_on_off;
	if(sorting_on_off===1){
        var child_items = frm.doc.items;
	
        child_items.sort(function(a, b) {
            return a.pch_sort_order - b.pch_sort_order;
        });
        
}//end of sorting_on_off

        var array = "";
        console.log("child_items....." + JSON.stringify(child_items));
        for (var i = 0; i < child_items.length; i++) {
            var item_code = child_items[i]['item_code'];
            var item_display_in_delivery = fetch_display_in_delivery(item_code);
            console.log("item_display_in_delivery", item_display_in_delivery);
            var description = child_items[i]['description'];
            var qty = child_items[i]['qty'];
            var uom = child_items[i]['uom'];
            if (item_display_in_delivery == 1) {
                var duplicate_serial = array.concat(qty).concat(uom).concat(" ").concat(description).concat(" ").concat("|").concat(" ");
                console.log("duplicate_serial---------", duplicate_serial);

                array = duplicate_serial;

            } //end of if
        } //end of for loop
	
        console.log("array.....", array);
 
        cur_frm.set_value("pch_display", array);
    	
});
frappe.ui.form.on('Sales Invoice', 'after_save', function(frm, cdt, cdn) {
	var d = locals[cdt][cdn];
        var shipping_address_name = frm.doc.shipping_address_name;
        console.log("shipping_address_name.....", shipping_address_name);
        var delivery_route = fetch_delivery_route(shipping_address_name);
        console.log("delivery_route.....", delivery_route);
        cur_frm.set_value("pch_delivery_route", delivery_route);
	var sorting_on_off=frm.doc.pch_sorting_on_off;
	if(sorting_on_off===0){
        var child_items = frm.doc.items;
	
        child_items.sort(function(a, b) {
            return a.idx - b.idx;
        });
        
}//end of sorting_on_off

        var array = "";
        console.log("child_items....." + JSON.stringify(child_items));
        for (var i = 0; i < child_items.length; i++) {
            var item_code = child_items[i]['item_code'];
            var item_display_in_delivery = fetch_display_in_delivery(item_code);
            console.log("item_display_in_delivery", item_display_in_delivery);
            var description = child_items[i]['description'];
            var qty = child_items[i]['qty'];
            var uom = child_items[i]['uom'];
            if (item_display_in_delivery == 1) {
                var duplicate_serial = array.concat(qty).concat(uom).concat(" ").concat(description).concat(" ").concat("|").concat(" ");
                console.log("duplicate_serial---------", duplicate_serial);

                array = duplicate_serial;

            } //end of if
        } //end of for loop
	
        console.log("array.....", array);
 
        cur_frm.set_value("pch_display", array);
    	
});

function fetch_delivery_route(shipping_address_name) {
    console.log("entered into function");
    var pch_delivery_route = "";
    frappe.call({
        method: 'frappe.client.get_value',
        args: {
            'doctype': 'Address',
            'fieldname': 'pch_delivery_route',

            'filters': {
                 name: shipping_address_name,
            }
        },
        async: false,
        callback: function(r) {
            if (r.message) {
                pch_delivery_route = r.message.pch_delivery_route; 
            }
        }
    });
    return pch_delivery_route;
}

function fetch_display_in_delivery(item_code) {
    console.log("entered into function");
    var display_in_delivery = "";
    frappe.call({
        method: 'frappe.client.get_value',
        args: {
            'doctype': 'Item',
            'fieldname': 'pch_display_in_delivery',

            'filters': {
                item_code: item_code,
            }
        },
        async: false,
        callback: function(r) {
            if (r.message) {
                display_in_delivery = r.message.pch_display_in_delivery;
                console.log(item_group);
                console.log("readings-----------" + JSON.stringify(r.message));

            }
        }
    });
    return display_in_delivery;
}

frappe.ui.form.on('Sales Invoice Item', {
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

