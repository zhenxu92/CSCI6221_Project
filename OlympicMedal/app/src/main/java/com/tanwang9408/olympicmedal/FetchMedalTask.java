package com.tanwang9408.olympicmedal;

import android.net.Uri;
import android.os.AsyncTask;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;

/**
 * Created by tanwang on 9/16/16.
 */
public class FetchMedalTask extends AsyncTask<String, Void, ArrayList<MedalEntry>> {

    private final String LOG_TAG=FetchMedalTask.class.getSimpleName();



    @Override
    protected ArrayList<MedalEntry> doInBackground(String... params) {

        HttpURLConnection urlConnection = null;
        BufferedReader reader = null;

        // Will contain the raw JSON response as a string.
        String medalJsonStr = null;
        ArrayList<MedalEntry> result=new ArrayList<>();
        try {

            URL url;
            Uri uri = Uri.parse("http://192.168.0.100:8181/sports").buildUpon().
                    appendPath(params[0]).build();

            url = new URL(uri.toString());

            medalJsonStr = Utility.getJsonStringFromUri(url);

            JSONObject medalObject=new JSONObject(medalJsonStr);
            JSONArray medalArray=medalObject.getJSONArray("goldMedals");
            for(int i=0; i<medalArray.length();i++){
                JSONObject medal=medalArray.getJSONObject(i);
                int year=-1;
                if(medal.has("year")) {
                    year = medal.getInt("year");
                }

                String category="";
                if( medal.has("division")){
                    category=medal.getString("division");
                }
                String country="";
                if( medal.has("country")){
                    country=medal.getString("country");
                }
                MedalEntry medalEntry=new MedalEntry(year,category,country);
                result.add(medalEntry);

            }

            return result;



        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (JSONException e) {

            e.printStackTrace();
        } finally{
            if (urlConnection != null) {
                urlConnection.disconnect();
            }
            if (reader != null) {
                try {
                    reader.close();
                } catch (final IOException e) {
                    Log.e(LOG_TAG, "Error closing stream", e);
                }
            }
        }


        return null;
    }


}
