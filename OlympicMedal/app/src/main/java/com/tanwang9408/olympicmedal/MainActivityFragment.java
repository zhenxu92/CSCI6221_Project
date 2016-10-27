package com.tanwang9408.olympicmedal;

import android.content.Intent;
import android.support.v4.app.Fragment;
import android.os.Bundle;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ListView;

import java.util.ArrayList;
import java.util.concurrent.ExecutionException;

/**
 * A placeholder fragment containing a simple view.
 */
public class MainActivityFragment extends Fragment {

    private MedalAdapter mMedalAdapter;
    private String mCurrentCategory="Weightlifting";

    public MainActivityFragment() {
    }

    @Override
    public View onCreateView(final LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view=inflater.inflate(R.layout.fragment_main, container, false);

        ArrayList<MedalEntry> entries=new ArrayList<>();




        mMedalAdapter=new MedalAdapter(getActivity(),entries);
        ListView listMedalView=(ListView)view.findViewById(R.id.listView);
        listMedalView.setAdapter(mMedalAdapter);

        Button weightLiftingButton=(Button)view.findViewById(R.id.weightlifting_button);
        Button cyclingButton=(Button)view.findViewById(R.id.cycling_button);

        weightLiftingButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                FetchMedalTask fmt=new FetchMedalTask();
                try {
                    mMedalAdapter.clear();
                    mMedalAdapter.addAll(fmt.execute("Weightlifting").get());
                    mCurrentCategory="Weightlifting";
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (ExecutionException e) {
                    e.printStackTrace();
                }




            }
        });

        cyclingButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                FetchMedalTask fmt=new FetchMedalTask();
                try {
                    mMedalAdapter.clear();
                    mMedalAdapter.addAll(fmt.execute("Cycling").get());
                    mCurrentCategory="Cycling";
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (ExecutionException e) {
                    e.printStackTrace();
                }

            }
        });

        Button newButton=(Button)view.findViewById(R.id.button_new);
        newButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent=new Intent(getActivity(),AddMedalActivity.class);
                intent.putExtra("Category",mCurrentCategory);

                startActivity(intent);
            }
        });








        return view;
    }
}
