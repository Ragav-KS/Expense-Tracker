package com.ragav.expensetracker.plugins.gmailApi;

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
import com.google.api.client.googleapis.extensions.android.gms.auth.GoogleAccountCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.util.ExponentialBackOff;
import com.google.api.services.gmail.GmailScopes;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.List;

public class GoogleAuth {

  private static final List<String> SCOPES = Collections.singletonList(GmailScopes.GMAIL_READONLY);
  private final NetHttpTransport HTTP_TRANSPORT;
  private final ActivityResultLauncher<Intent> chooseAccountActivityLauncher;
  private final ActivityResultLauncher<Intent> authorisationActivityLauncher;
  private final GoogleAccountCredential mCredential;
  private final Activity activity;
  private final Context context;
  private String token = null;

  // TODO: fix static field leak
  @SuppressLint("StaticFieldLeak")
  public GoogleAuth(Activity activity, Context context) throws GeneralSecurityException, IOException {
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

          new GetTokenTask().execute();
        }
      });

    chooseAccountActivityLauncher = ((ComponentActivity) activity)
      .registerForActivityResult(
        new ActivityResultContracts.StartActivityForResult(),
        result -> {
          if (result.getResultCode() == Activity.RESULT_OK) {
            Intent data = result.getData();

            if (data != null) {
              String accountName = data.getStringExtra(AccountManager.KEY_ACCOUNT_NAME);

              mCredential.setSelectedAccountName(accountName);

              synchronized (GoogleAuth.this) {
                notify();
              }
            }
          }
        });

  }

  public synchronized String getToken() {
    chooseAccountActivityLauncher.launch(mCredential.newChooseAccountIntent());

    try {
      this.wait();
    } catch (InterruptedException e) {
      throw new RuntimeException(e);
    }

    new GetTokenTask().execute();

    try {
      this.wait();
    } catch (InterruptedException e) {
      throw new RuntimeException(e);
    }

    return token;
  }

  class GetTokenTask extends AsyncTask {
    @Override
    protected Object doInBackground(Object[] objects) {
      try {
        token = mCredential.getToken();
      } catch (UserRecoverableAuthException e) {
        authorisationActivityLauncher.launch(e.getIntent());
        return null;
      } catch (GoogleAuthException | IOException e) {
        throw new RuntimeException(e);
      }

      synchronized (GoogleAuth.this) {
        GoogleAuth.this.notify();
      }

      return null;
    }
  }

}
