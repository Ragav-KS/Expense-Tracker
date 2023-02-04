package com.ragav.expensetracker.plugins.gmailApi;

import android.accounts.Account;
import android.accounts.AccountManager;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;

import androidx.activity.ComponentActivity;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;

import com.google.android.gms.auth.GoogleAuthException;
import com.google.android.gms.auth.UserRecoverableAuthException;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.api.client.googleapis.extensions.android.gms.auth.GoogleAccountCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.util.ExponentialBackOff;
import com.google.api.services.gmail.GmailScopes;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.List;

public class GmailApi {

  private final NetHttpTransport HTTP_TRANSPORT;
  private String token = null;
  private GoogleAccountCredential mCredential;
  private Activity activity;
  private Context context;

  private final ActivityResultLauncher<Intent> chooseAccountActivityLauncher;
  private final ActivityResultLauncher<Intent> authorisationActivityLauncher;

  private static final List<String> SCOPES = Collections.singletonList(GmailScopes.GMAIL_READONLY);

  // TODO: fix static field leak
  @SuppressLint("StaticFieldLeak")
  public GmailApi(Activity activity, Context context) throws GeneralSecurityException, IOException {
    this.activity = activity;
    this.context = context;

    HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();

    mCredential = GoogleAccountCredential
      .usingOAuth2(context.getApplicationContext(), SCOPES)
      .setBackOff(new ExponentialBackOff());

    authorisationActivityLauncher = ((ComponentActivity) activity).registerForActivityResult(
      new ActivityResultContracts.StartActivityForResult(),
      result -> {
        if (result.getResultCode() == Activity.RESULT_OK) {
          Intent data = result.getData();
          System.out.println(data);
        }
      });

    chooseAccountActivityLauncher = ((ComponentActivity) activity)
      .registerForActivityResult(
        new ActivityResultContracts.StartActivityForResult(),
        result -> {
          if (result.getResultCode() == Activity.RESULT_OK) {
            Intent data = result.getData();

            String accountName;
            if (data != null) {
              accountName = data.getStringExtra(AccountManager.KEY_ACCOUNT_NAME);
              mCredential.setSelectedAccountName(accountName);

              new AsyncTask<Void, Void, Void>() {
                @Override
                protected Void doInBackground(Void... voids) {
                  try {
                    token = mCredential.getToken();
                  } catch (UserRecoverableAuthException e) {
                    authorisationActivityLauncher.launch(e.getIntent());
                  } catch (GoogleAuthException | IOException e) {
                    throw new RuntimeException(e);
                  }

                  return null;
                }
              }.execute();

            }
          }
        });
  }

  public void loadToken() {
    chooseAccountActivityLauncher.launch(mCredential.newChooseAccountIntent());
  }

  public String getToken() {
    return token;
  }
}
