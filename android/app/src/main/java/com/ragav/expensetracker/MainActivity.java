package com.ragav.expensetracker;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.ragav.expensetracker.plugins.gmailApi.GoogleAuthPlugin;

public class MainActivity extends BridgeActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    registerPlugin(GoogleAuthPlugin.class);
    super.onCreate(savedInstanceState);

  }
}
