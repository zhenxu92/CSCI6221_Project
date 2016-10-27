package com.tanwang9408.olympicmedal;

import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by tanwang on 9/15/16.
 */
public class MedalAdapter extends ArrayAdapter<MedalEntry> {

    public MedalAdapter(Activity context, List<MedalEntry> medalEntries){
        super(context,0,medalEntries);
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {

        MedalEntry entry=getItem(position);

        if (convertView == null) {
            convertView = LayoutInflater.from(getContext()).inflate(R.layout.list_item_medal, parent, false);
        }

        TextView yearView=(TextView)convertView.findViewById(R.id.list_item_year_view);
        if(entry.year<0){
            yearView.setText("Not known");
        }
        else {
            yearView.setText(Integer.toString(entry.year));
        }

        TextView categoryView=(TextView)convertView.findViewById(R.id.list_item_category_view);
        categoryView.setText(entry.category);

        TextView countryView=(TextView)convertView.findViewById(R.id.list_item_country_view);
        countryView.setText(entry.country);


        return convertView;
    }
}
