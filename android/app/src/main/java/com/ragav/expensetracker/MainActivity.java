package com.ragav.expensetracker;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.ragav.expensetracker.plugins.gmailApi.GmailApiPlugin;

public class MainActivity extends BridgeActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    registerPlugin(GmailApiPlugin.class);
    super.onCreate(savedInstanceState);

  }
}
