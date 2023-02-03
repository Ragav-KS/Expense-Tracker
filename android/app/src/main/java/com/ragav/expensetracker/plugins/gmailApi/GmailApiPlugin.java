package com.ragav.expensetracker.plugins.gmailApi;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "gmailAPI")
public class GmailApiPlugin extends Plugin {

  private  GmailApi implementation;

  @Override
  public void load() {
    super.load();
    implementation = new GmailApi(getActivity(), getContext());
  }

  @PluginMethod()
  public void initialize(PluginCall call) {
    String value = call.getString("androidClientID");
    System.out.println(value);

    JSObject ret = new JSObject();
    ret.put("success", true);
    call.resolve(ret);
  }
}
