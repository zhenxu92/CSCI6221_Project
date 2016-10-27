package com.tanwang9408.olympicmedal;

import android.net.Uri;
import android.os.AsyncTask;
import android.support.v4.util.Pair;
import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

/**
 * Created by tanwang on 9/16/16.
 */
public class AddMedalTask extends AsyncTask<Pair<String,MedalEntry>, Void, Void> {

    private static final String LOG_TAG = AddMedalTask.class.getSimpleName();



    @Override
    protected Void doInBackground(Pair<String, MedalEntry>... params) {
        HttpURLConnection urlConnection = null;
        BufferedReader reader = null;


        try {
            URL url;
            Uri uri = Uri.parse("http://192.168.0.100:8181/sports").buildUpon().
                    appendPath(params[0].first).appendPath("medals").build();

            url = new URL(uri.toString());
            JSONObject json = new JSONObject();
            MedalEntry entry=params[0].second;
            json.put("division", entry.category);
            json.put("country", entry.country);
            json.put("year", entry.year);
            JSONObject jsonMedal = new JSONObject();
            jsonMedal.put("medal", json);


            String postResult = Utility.postJsonStringToUri(url, jsonMedal);
            Log.e(LOG_TAG, postResult);


        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (JSONException e) {
            e.printStackTrace();
        } finally {

        }

        return null;
    }
}
