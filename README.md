# Train-Delay-Higher-Lower

This repo is for my weekend hackathon project to implement a higher lower style game with realtime data.
You have to guess which of the shown train stations currently has more combined delay minutes across all its trains arriving in the next 30 minutes.

Check it out on [david.merz.dev/Train-Delay-Higher-Lower/](https://david.merz.dev/Train-Delay-Higher-Lower/)

## Locally develop yourself

Install the dependencies and run it...

```bash
npm install
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see the website running with live reload.

## Android App

I basically followed [this capacitor tutorial](https://capacitorjs.com/docs/android) and the only real hiccup was installing **Android SDK 29** not the newest Android SDK 30 because Capacitor builds for this older SDK.

## See more

For more info about the used web framework _svelte_ see [this README](https://github.com/sveltejs/template/blob/master/README.md)
