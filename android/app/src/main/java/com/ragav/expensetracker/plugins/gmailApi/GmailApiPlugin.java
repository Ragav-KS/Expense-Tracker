package com.ragav.expensetracker.plugins.gmailApi;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.IOException;
import java.security.GeneralSecurityException;

@CapacitorPlugin(name = "gmailAPI")
public class GmailApiPlugin extends Plugin {

  private  GmailApi implementation;

  @Override
  public void load() {
    super.load();

    try {
      implementation = new GmailApi(getActivity(), getContext());
    } catch (Exception e) {
      throw new RuntimeException(e);
    }


  }

  @PluginMethod()
  public void initialize(PluginCall call) {
    String value = call.getString("androidClientID");
    System.out.println(value);

    JSObject ret = new JSObject();
    ret.put("success", true);
    call.resolve(ret);
  }

  @PluginMethod()
  public void loadToken(PluginCall call) {
    implementation.loadToken();

    call.resolve();
  }
  @PluginMethod
  public void getToken(PluginCall call) {
    String token = implementation.getToken();

    JSObject ret = new JSObject();
    ret.put("token", token);
    call.resolve(ret);
  }

}
