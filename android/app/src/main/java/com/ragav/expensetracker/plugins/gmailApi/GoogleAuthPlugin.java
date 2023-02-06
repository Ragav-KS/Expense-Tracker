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
    String value = call.getString("androidClientID");
    System.out.println(value);

    JSObject ret = new JSObject();
    ret.put("success", true);
    call.resolve(ret);
  }

  @PluginMethod
  public void getToken(PluginCall call) {
    String token = implementation.getToken();

    JSObject ret = new JSObject();
    ret.put("token", token);
    call.resolve(ret);
  }

}
