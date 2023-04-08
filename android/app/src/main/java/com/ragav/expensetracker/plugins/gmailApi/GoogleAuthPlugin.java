package com.ragav.expensetracker.plugins.gmailApi;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "GoogleAuth")
public class GoogleAuthPlugin extends Plugin {

  private GoogleAuth implementation;

  @Override
  public void load() {
    super.load();

    try {
      implementation = new GoogleAuth(getActivity(), getContext());
    } catch (Exception e) {
      throw new RuntimeException(e);
    }

  }

  @PluginMethod()
  public void initialize(PluginCall call) {
    // Params
    String value = call.getString("androidClientID"); // Just realized that this thing works without ClientID 😐. Will decide later what to do with this.

    // Return
    call.resolve();
  }

  @PluginMethod
  public void getToken(PluginCall call) {
    // Params
    String value = call.getString("selectedAccount", null);

    // body
    String token = implementation.getToken(value);

    // Return
    JSObject ret = new JSObject();
    ret.put("token", token);
    call.resolve(ret);
  }

}
