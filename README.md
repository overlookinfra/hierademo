# Interactive Hiera demo

This is a simplified simulation of the process that Hiera goes through as it resolves each layer in its
hierarchy while looking for requested keys. This simulation matches exactly how legacy Hiera works. Modern
Hiera conceptually works similarly, but adds in several layers of complexity and more data sources.

Once you use this simulation to understand how each layer and source is resolved from the available facts,
then the documentation for the added complexity for modern Hiera will make a lot more sense.

[Try it out!](https://puppetlabs.github.io/hierademo)

Click the `[Interpolate Facts]` button a few times to see how the values resolve in the layer names, then
change the facts listed on the left side of the page and try again.

Then compare those layers to the datasource files listed underneath the `hiera.yaml` file. Click each one
to expand it. Interpolate the facts in `hiera.yaml` and compare the layers to the filenames. Expand the
datasource contents by clicking on each of them and see what data is available in each.

Finally, type a key to resolve in the upper left and press the `[Lookup]` button. See how each layer is
inspected, one at a time. If it resolves to the path of a file that exists, that datasource will expand
to show its contents, and if the key matches something in the file, then the simulation returns that value.

The status of the simulation runs in the top message box.

Have fun, and contribute any fixes needed if you find a bug!
