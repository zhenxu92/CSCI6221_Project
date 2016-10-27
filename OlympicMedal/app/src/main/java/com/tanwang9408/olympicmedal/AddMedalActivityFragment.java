package com.tanwang9408.olympicmedal;

import android.support.v4.app.Fragment;
import android.os.Bundle;
import android.support.v4.app.NotificationCompat;
import android.support.v4.util.Pair;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

/**
 * A placeholder fragment containing a simple view.
 */
public class AddMedalActivityFragment extends Fragment {

    private String mCategory;

    public AddMedalActivityFragment() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        mCategory=getActivity().getIntent().getStringExtra("Category");

        View view=inflater.inflate(R.layout.fragment_add_medal, container, false);
        TextView addMedalTitle=(TextView)view.findViewById(R.id.text_add_medal_title);
        addMedalTitle.setText("Add Medal for "+mCategory);


        Button addMedalButton=(Button)view.findViewById(R.id.button_add_medal);
        final EditText editYear=(EditText)view.findViewById(R.id.edit_year);
        final EditText editCategory=(EditText)view.findViewById(R.id.edit_division);
        final EditText editCountry=(EditText)view.findViewById(R.id.edit_country);
        addMedalButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AddMedalTask amt=new AddMedalTask();
                int yearEntry=Integer.parseInt(editYear.getText().toString());
                String categoryEntry=editCategory.getText().toString();
                String countryEntry=editCountry.getText().toString();
                MedalEntry medalEntry=new MedalEntry(yearEntry,categoryEntry,countryEntry);
                Pair pair=new Pair(mCategory,medalEntry);
                amt.execute(pair);
            }
        });

        return view;
    }
}
