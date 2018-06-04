import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { Functionality, Scenario, Step, TestPlan } from 'app/hierarchy-model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public hierarchy: TreeNode[];
  public selectedNode: TreeNode;


  public onNodeExpandCollapse(event): void {
    let timer = Date.now();
    let originalEvent = event.originalEvent;
    if (originalEvent.shiftKey) {
      // expand all!
      let node = event.node as TreeNode;
      this.expandNode(node, !node.expanded);
      (node).expanded = !node.expanded;
      // You may wonder "Why the hell are we doing that last assignation??" It is because this is called before PrimeNg actually do the
      // expand. So we need to set the current node expanded state to the original value before continuing.
    }
    console.debug(`*** Expand took ${Date.now() - timer}ms`);
  }

  private expandNode(node: TreeNode, expand: boolean) {
    node.expanded = expand;

    if (node.children && node.children.length > 0) {
      for (let child of node.children) {
        this.expandNode(child, expand);
      }
    }
  }

  public getTypeName(type: string): string {
    switch (type) {
      case 'project':
        return 'Pr';
      case 'test-plan':
        return 'Tp';
      case 'functionality':
        return 'Fu';
      case 'scenario':
        return 'Sc';
      case 'step':
        return 'St';
    }
  }

  private currentTreeNode: TreeNode[];
  public ngOnInit(): void {

    this.currentTreeNode = [];

    for (let project of this.projects) {
      let newNode: TreeNode = {
        label: project.name,
        data: {name: project.name, id: project.id, type: "project"},
        // expandedIcon: this.projectIconClasses,
        // collapsedIcon: this.projectIconClasses
      };

      if (project.testPlans && project.testPlans.length > 0) {
        newNode.children = this.generateTestPlanChildren(project.testPlans, newNode);
      }

      this.checkState(newNode);

      this.currentTreeNode.push(newNode);
    }

    this.hierarchy = this.currentTreeNode;
  }

  private generateTestPlanChildren(testPlans: TestPlan[], parent: TreeNode): TreeNode[] {

    let testPlaneChildren: TreeNode[] = [];

    for (let testPlan of testPlans) {
      let newTestPlanNode: TreeNode = {
        label: testPlan.name,
        data: {name: testPlan.name, id: testPlan.id, type: "test-plan"},
        // expandedIcon: this.testPlanIconClasses,
        // collapsedIcon: this.testPlanIconClasses,
        parent
      };

      if (testPlan.functionalities && testPlan.functionalities.length > 0) {
        newTestPlanNode.children = this.generateFunctionalityChildren(testPlan.functionalities, newTestPlanNode);
      }

      this.checkState(newTestPlanNode);

      testPlaneChildren.push(newTestPlanNode);
    }

    return testPlaneChildren;
  }

  private generateFunctionalityChildren(functionalities: Functionality[], parent: TreeNode) {
    let functionalityChildrens: TreeNode[] = [];

    for (let functionality of functionalities) {
      let newFunctionalityNode: TreeNode = {
        label: functionality.name,
        data: {name: functionality.name, id: functionality.id, type: "functionality"},
        // expandedIcon: this.functionalityIconClasses,
        // collapsedIcon: this.functionalityIconClasses,
        parent: parent
      };

      if (functionality.scenarios && functionality.scenarios.length > 0) {
        newFunctionalityNode.children = this.generateScenarioChildren(functionality.scenarios, newFunctionalityNode);
      }

      this.checkState(newFunctionalityNode);

      functionalityChildrens.push(newFunctionalityNode);
    }

    return functionalityChildrens;
  }

  private generateScenarioChildren(scenarios: Scenario[], parent: TreeNode) {
    let scenarioChildrens: TreeNode[] = [];

    for (let scenario of scenarios) {
      let newScenarioNode: TreeNode = {
        label: scenario.name,
        data: {name: scenario.name, id: scenario.id, type: "scenario"},
        // expandedIcon: this.scenarioIconClasses,
        // collapsedIcon: this.scenarioIconClasses,
        parent: parent
      };

      if (scenario.steps && scenario.steps.length > 0) {
        newScenarioNode.children = this.generateStepChildren(scenario.steps, newScenarioNode);
      }

      this.checkState(newScenarioNode);

      scenarioChildrens.push(newScenarioNode);
    }

    return scenarioChildrens;
  }

  private generateStepChildren(steps: Step[], parent: TreeNode) {
    let stepChildrens: TreeNode[] = [];

    for (let step of steps) {
      let newStepNode: TreeNode = {
        label: step.name,
        data: {name: step.name, id: step.id, type: "step"},
        // icon: this.stepIconClasses,
        parent: parent
      };

      this.checkState(newStepNode);

      stepChildrens.push(newStepNode);
    }

    return stepChildrens;
  }

  private checkState(newNode: TreeNode) {
    let key = newNode.data.type + '/' + newNode.data.id;
    let nodeSate = this.nodesMap.get(key);

    if (nodeSate !== undefined) {
      newNode.expanded = nodeSate.expanded;
    }

    this.nodesMap.set(key, newNode);
  }

  private nodesMap: Map<string, TreeNode> = new Map<string, TreeNode>();

  private projects = [ {
    "id" : 1,
    "name" : "Dollarama AQ",
    "testPlans" : [ {
      "id" : 41,
      "name" : "03-DWS (Mobile Shopping and Checkout)",
      "functionalities" : [ {
        "id" : 236,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 450,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 1969,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 1970,
            "name" : "Login Info"
          } ]
        }, {
          "id" : 452,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 1973,
            "name" : "Open Browser With Type Of Browser And Selenium Hub"
          }, {
            "id" : 1974,
            "name" : "Log Information"
          } ]
        } ]
      }, {
        "id" : 237,
        "name" : "Validate An Anonymous Action",
        "scenarios" : [ {
          "id" : 453,
          "name" : "Validate Favorite",
          "steps" : [ {
            "id" : 1975,
            "name" : "Validate Favorite Header"
          }, {
            "id" : 1976,
            "name" : "Validate Adding an article to Wish list from Department Page"
          }, {
            "id" : 1977,
            "name" : "Validate Adding an article to Wish list from You may also like on Article Page"
          }, {
            "id" : 1978,
            "name" : "Validate Adding an article to Wish list from Search Results Page"
          }, {
            "id" : 1979,
            "name" : "Validate Adding an article to Wish list from Article Page"
          } ]
        } ]
      }, {
        "id" : 238,
        "name" : "Validate Registered User",
        "scenarios" : [ {
          "id" : 454,
          "name" : "Validate A Registered Favorite List And Wish List Department",
          "steps" : [ {
            "id" : 1980,
            "name" : "Validate Add Wish List Article"
          }, {
            "id" : 1981,
            "name" : "Validate Share Favorite List"
          }, {
            "id" : 1982,
            "name" : "Validate Delete Wish List Article"
          }, {
            "id" : 1983,
            "name" : "Validate Empty Favorite List"
          }, {
            "id" : 1984,
            "name" : "Validate Account Side Menu Anglais"
          }, {
            "id" : 1985,
            "name" : "Validate Item Out Of Stock"
          }, {
            "id" : 1986,
            "name" : "Validate Wish List"
          }, {
            "id" : 1987,
            "name" : "Validate Minimum Order (150$ - QA)"
          }, {
            "id" : 1988,
            "name" : "Validate Modify Case Quantity"
          }, {
            "id" : 1989,
            "name" : "Validate Checkout"
          }, {
            "id" : 1990,
            "name" : "Validate Add New Address for Checkout"
          } ]
        } ]
      }, {
        "id" : 239,
        "name" : "Validate Guest User",
        "scenarios" : [ {
          "id" : 455,
          "name" : "Validate Guest User Place Order",
          "steps" : [ {
            "id" : 1991,
            "name" : "Sign Out"
          }, {
            "id" : 1992,
            "name" : "Validate messages for order placing"
          }, {
            "id" : 1993,
            "name" : "Validate Guest user uses same address for billing and shipping purposes"
          }, {
            "id" : 1994,
            "name" : "Validate Guest user uses a different address for billing and shipping purposes"
          }, {
            "id" : 1995,
            "name" : "Validate Guest user adds a new shipping address"
          }, {
            "id" : 1996,
            "name" : "Validate Guest user edits a shipping address"
          }, {
            "id" : 1997,
            "name" : "Validate Guest user adds a new billing address"
          }, {
            "id" : 1998,
            "name" : "Validate Guest user edits a billing address"
          } ]
        } ]
      }, {
        "id" : 240,
        "name" : "Validate AVS Response codes",
        "scenarios" : [ {
          "id" : 456,
          "name" : "AVS test Declined Cards",
          "steps" : [ {
            "id" : 1999,
            "name" : "Login"
          }, {
            "id" : 2000,
            "name" : "Go to Order Now page and fill in partial card information"
          }, {
            "id" : 2001,
            "name" : "Declined from Issuer Y"
          }, {
            "id" : 2002,
            "name" : "Declined Call From Auth S"
          }, {
            "id" : 2003,
            "name" : "Declined From Issuer U"
          }, {
            "id" : 2004,
            "name" : "Declined Call for Auth invalid CVV2 Y"
          }, {
            "id" : 2005,
            "name" : "Declined Call For Auth Z"
          } ]
        } ]
      }, {
        "id" : 241,
        "name" : "Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 457,
          "name" : "Close Browser UnMap And Delete Directories",
          "steps" : [ {
            "id" : 2006,
            "name" : "Login information"
          }, {
            "id" : 2007,
            "name" : "Un Map and Delete The Directory"
          }, {
            "id" : 2008,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 42,
      "name" : "01-Mobile Tablette (Android Product Catalog Chrome EN)",
      "functionalities" : [ {
        "id" : 242,
        "name" : "01_Setting Of Selenium, Browser And Variables",
        "scenarios" : [ {
          "id" : 459,
          "name" : "01_Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 2018,
            "name" : "01_Setting Variables (Data Repository)"
          }, {
            "id" : 2019,
            "name" : "02_Log for Data Repository"
          } ]
        }, {
          "id" : 461,
          "name" : "03_Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 2022,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub Physique"
          }, {
            "id" : 2099,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub Simulator"
          }, {
            "id" : 3515,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub Simulator MacDev1"
          }, {
            "id" : 2023,
            "name" : "02_Log When Browser is opened"
          } ]
        } ]
      }, {
        "id" : 243,
        "name" : "02_Set Language English",
        "scenarios" : [ {
          "id" : 462,
          "name" : "01_Set Language English",
          "steps" : [ {
            "id" : 2024,
            "name" : "01_Set Language English"
          } ]
        } ]
      }, {
        "id" : 244,
        "name" : "03_Validate Content validation and Browse articles from home page",
        "scenarios" : [ {
          "id" : 463,
          "name" : "01_Validate Home Page",
          "steps" : [ {
            "id" : 2025,
            "name" : "01_Validate Sticky header"
          }, {
            "id" : 2026,
            "name" : "02_Validate Start shopping Button on Banner and the Shop now"
          } ]
        }, {
          "id" : 464,
          "name" : "02_Validate Header",
          "steps" : [ {
            "id" : 2027,
            "name" : "01_Validate Top Middle - Header"
          }, {
            "id" : 2028,
            "name" : "02_Validate Low - Header"
          } ]
        } ]
      }, {
        "id" : 245,
        "name" : "04_Validate Shop By Activity and Department - menu & sub-menu items",
        "scenarios" : [ {
          "id" : 465,
          "name" : "01_Validate All menu and sub-menu for Departments",
          "steps" : [ {
            "id" : 2030,
            "name" : "Validate Sub-menu for Cleaning"
          }, {
            "id" : 2123,
            "name" : "Validate Sub-menu for Clothing"
          }, {
            "id" : 2124,
            "name" : "Validate Sub-menu for Electronics"
          }, {
            "id" : 2125,
            "name" : "Validate Sub-menu for Food"
          }, {
            "id" : 2126,
            "name" : "Validate Sub-menu for Hardware"
          }, {
            "id" : 2127,
            "name" : "Validate Sub-menu for Health & Beauty"
          }, {
            "id" : 2128,
            "name" : "Validate Sub-menu for Home Decor"
          }, {
            "id" : 2130,
            "name" : "Validate Sub-menu for Kitchen"
          }, {
            "id" : 2131,
            "name" : "Validate Sub-menu for Office"
          }, {
            "id" : 2132,
            "name" : "Validate Sub-menu for Party"
          }, {
            "id" : 2133,
            "name" : "Validate Sub-menu for Pets"
          }, {
            "id" : 2134,
            "name" : "Validate Sub-menu for Toys"
          } ]
        }, {
          "id" : 466,
          "name" : "02_Validate All Menu and sub-menu Activity",
          "steps" : [ {
            "id" : 2042,
            "name" : "Validate menu roll down for Activity"
          }, {
            "id" : 2043,
            "name" : "Validate menu for shop by Activity"
          }, {
            "id" : 2044,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels"
          }, {
            "id" : 2045,
            "name" : "Validate Sub-menu Event, Party & Wedding Planning"
          }, {
            "id" : 2046,
            "name" : "Validate Sub-menu Hospital & Care Facilities"
          }, {
            "id" : 2047,
            "name" : "Validate Sub-menu Maintenance"
          }, {
            "id" : 2048,
            "name" : "Validate Sub-menu Offices"
          }, {
            "id" : 2049,
            "name" : "Validate Sub-menu Schools"
          } ]
        } ]
      }, {
        "id" : 246,
        "name" : "05_Validate Filter",
        "scenarios" : [ {
          "id" : 467,
          "name" : "01_Validate Filter Department",
          "steps" : [ {
            "id" : 2050,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 2891,
            "name" : "02_Validate Filter By Departments"
          }, {
            "id" : 3253,
            "name" : "03_Validate Filter by Business"
          }, {
            "id" : 2892,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 3241,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 3255,
            "name" : "05_Validate Many Filter Same time"
          } ]
        }, {
          "id" : 743,
          "name" : "02_Validate Filter Activity",
          "steps" : [ {
            "id" : 3256,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 3257,
            "name" : "02_Validate Filter By Departments"
          }, {
            "id" : 3258,
            "name" : "03_Validate Filter by Business"
          }, {
            "id" : 3259,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 3260,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 3261,
            "name" : "05_Validate Many Filter Same time"
          } ]
        }, {
          "id" : 468,
          "name" : "02_Validate Filter ActivityOLD",
          "steps" : [ {
            "id" : 2055,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 2056,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 2057,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 2058,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 2059,
            "name" : "05_Validate Many Filters Same time"
          } ]
        } ]
      }, {
        "id" : 247,
        "name" : "06_Validate Short",
        "scenarios" : [ {
          "id" : 469,
          "name" : "01_Validate Short Department",
          "steps" : [ {
            "id" : 2060,
            "name" : "01_Validate Price per case Low to High"
          }, {
            "id" : 3262,
            "name" : "02_Validate Price per case High to Low"
          }, {
            "id" : 3263,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 3264,
            "name" : "04_Validate Name Z to A"
          }, {
            "id" : 3265,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 3266,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        }, {
          "id" : 470,
          "name" : "02_Validate Short Activity",
          "steps" : [ {
            "id" : 2066,
            "name" : "01_Validate price per Case Low to High"
          }, {
            "id" : 2067,
            "name" : "02_Validate price per Case High to Low"
          }, {
            "id" : 2068,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 2069,
            "name" : "04_Validatre Name Z to A"
          }, {
            "id" : 2070,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 2071,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        } ]
      }, {
        "id" : 248,
        "name" : "07_Validate Article Page Content",
        "scenarios" : [ {
          "id" : 471,
          "name" : "01_Validate Department Article Page",
          "steps" : [ {
            "id" : 2072,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 3267,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 2074,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 2075,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 2076,
            "name" : "05_Validate Article title"
          }, {
            "id" : 2077,
            "name" : "06_Validate You may also like"
          }, {
            "id" : 3268,
            "name" : "Copy of 03_Validate Add Favorite in article page"
          } ]
        }, {
          "id" : 472,
          "name" : "02_Validate Activity Article Page",
          "steps" : [ {
            "id" : 2078,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 2079,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 2080,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 2081,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 2082,
            "name" : "05_Validate Article title"
          }, {
            "id" : 2083,
            "name" : "06_Validate You may also like"
          } ]
        } ]
      }, {
        "id" : 249,
        "name" : "08_Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 473,
          "name" : "01_UnMap And Delete Directory",
          "steps" : [ {
            "id" : 2084,
            "name" : "01_Log To UnMap"
          }, {
            "id" : 2085,
            "name" : "02_Un Map and Delete The Directory On Server And Virtual Machine"
          } ]
        }, {
          "id" : 474,
          "name" : "02_Close browser",
          "steps" : [ {
            "id" : 2086,
            "name" : "01_Logging of the Teardown"
          }, {
            "id" : 2087,
            "name" : "02_Close Application Mobile"
          } ]
        } ]
      } ]
    }, {
      "id" : 86,
      "name" : "Copy of 02-DWS (Desktop My Account FireFox EN)",
      "functionalities" : [ {
        "id" : 536,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 1009,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 4615,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 4616,
            "name" : "Log Setting Variables (Data Repository)"
          } ]
        }, {
          "id" : 1010,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 4617,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 4618,
            "name" : "Log Of Setting Selenium Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 1011,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 4619,
            "name" : "Setting The Opening Of Browser With Selenium Hub"
          } ]
        } ]
      }, {
        "id" : 537,
        "name" : "Set Language English",
        "scenarios" : [ {
          "id" : 1012,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 4620,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 538,
        "name" : "Validate My Account",
        "scenarios" : [ {
          "id" : 1013,
          "name" : "Validate Login Functions",
          "steps" : [ {
            "id" : 4621,
            "name" : "Validate Login Logout"
          }, {
            "id" : 4622,
            "name" : "Validate Login Forgot Password"
          } ]
        }, {
          "id" : 1014,
          "name" : "Validate User",
          "steps" : [ {
            "id" : 4623,
            "name" : "Validate User Creation"
          }, {
            "id" : 4624,
            "name" : "Validate User Address Creation"
          } ]
        }, {
          "id" : 1015,
          "name" : "Validate Page Account",
          "steps" : [ {
            "id" : 4625,
            "name" : "Validate Create Blank Account"
          }, {
            "id" : 4626,
            "name" : "Validate Create Account With Invalid Data"
          }, {
            "id" : 4627,
            "name" : "Validate User Register Account Invalid Password"
          }, {
            "id" : 4628,
            "name" : "Validate User Register Account Different Password"
          }, {
            "id" : 4629,
            "name" : "Validate Logged User Shopping Cart Remember"
          }, {
            "id" : 4630,
            "name" : "Validate Modify Account And information French"
          }, {
            "id" : 4631,
            "name" : "Validate Modify Account And information English"
          }, {
            "id" : 4632,
            "name" : "Validate information into Login page"
          }, {
            "id" : 4633,
            "name" : "Validate Stay in checkbox"
          }, {
            "id" : 4634,
            "name" : "Validate Forgot password xxx(Inclu dans Validate Login Functions) xxx"
          } ]
        } ]
      }, {
        "id" : 539,
        "name" : "Close Browser",
        "scenarios" : [ {
          "id" : 1016,
          "name" : "Close Browser",
          "steps" : [ {
            "id" : 4635,
            "name" : "Log Of Closing Browser"
          }, {
            "id" : 4636,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 67,
      "name" : "01_DWS (Desktop Product Catalog Chrome FR)",
      "functionalities" : [ {
        "id" : 393,
        "name" : "01_Setting Of Selenium, Browser And Variables vvvv",
        "scenarios" : [ {
          "id" : 744,
          "name" : "01_Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 3269,
            "name" : "01_Setting Variables (Data Repository)"
          }, {
            "id" : 3270,
            "name" : "02_Log for Data Repository"
          } ]
        }, {
          "id" : 745,
          "name" : "02_Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 3271,
            "name" : "01_Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 3272,
            "name" : "02_Logging of Setting Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 746,
          "name" : "03_Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 3273,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub"
          }, {
            "id" : 3274,
            "name" : "02_Log When Browser is opened"
          } ]
        } ]
      }, {
        "id" : 394,
        "name" : "02_Set Language French",
        "scenarios" : [ {
          "id" : 747,
          "name" : "01_Set Language French",
          "steps" : [ {
            "id" : 3275,
            "name" : "01_Set Language French"
          } ]
        } ]
      }, {
        "id" : 395,
        "name" : "03_Validate Content validation and Browse articles from home page",
        "scenarios" : [ {
          "id" : 748,
          "name" : "01_Validate Home Page",
          "steps" : [ {
            "id" : 3276,
            "name" : "01_Validate Sticky header"
          }, {
            "id" : 3277,
            "name" : "02_Validate Start shopping Button on Banner and the Shop now"
          } ]
        }, {
          "id" : 749,
          "name" : "02_Validate Header",
          "steps" : [ {
            "id" : 3278,
            "name" : "01_Validate Top Middle - Header"
          }, {
            "id" : 3279,
            "name" : "02_Validate Low - Header"
          } ]
        } ]
      }, {
        "id" : 396,
        "name" : "04_Validate Shop By Activity and Department - menu & sub-menu items",
        "scenarios" : [ {
          "id" : 750,
          "name" : "01_Validate All menu and sub-menu for Departments",
          "steps" : [ {
            "id" : 3280,
            "name" : "Validate menu for shop by Department"
          }, {
            "id" : 3281,
            "name" : "Validate Sub-menu for Food (Alimentation)"
          }, {
            "id" : 3282,
            "name" : "Validate Sub-menu for Pets (Animaux)"
          }, {
            "id" : 3283,
            "name" : "Validate Sub-menu for Pets (Animaux) - Part 2"
          }, {
            "id" : 3284,
            "name" : "Validate Sub-menu for Party (Célébrations)"
          }, {
            "id" : 3285,
            "name" : "Validate Sub-menu for Party (Célébrations) - Part 2"
          }, {
            "id" : 3286,
            "name" : "Validate Sub-menu for Kitchen (Cuisine)"
          }, {
            "id" : 3287,
            "name" : "Validate Sub-menu for Kitchen (Cuisine) - Part 2"
          }, {
            "id" : 3288,
            "name" : "Validate Sub-menu for Electronics (Électronique)"
          }, {
            "id" : 3289,
            "name" : "Validate Sub-menu for Electronics (Électronique) - Part 2"
          }, {
            "id" : 3290,
            "name" : "Validate Sub-menu for Office (Fournitures de bureau)"
          }, {
            "id" : 3291,
            "name" : "Validate Sub-menu for Office (Fournitures de bureau) - Part 2"
          }, {
            "id" : 3292,
            "name" : "Validate Sub-menu for Toys (Jouets)"
          }, {
            "id" : 3293,
            "name" : "Validate Sub-menu for Home Decor (Maison)"
          }, {
            "id" : 3294,
            "name" : "Validate Sub-menu for Home Decor (Maison) - Part 2"
          }, {
            "id" : 3295,
            "name" : "Validate Sub-menu for Cleaning (Produits ménagers)"
          }, {
            "id" : 3296,
            "name" : "Validate Sub-menu for Cleaning (Produits ménagers) - Part 2"
          }, {
            "id" : 3297,
            "name" : "Validate Sub-menu for Hardware (Quincaillerie)"
          }, {
            "id" : 3298,
            "name" : "Validate Sub-menu for Cleaning (Quincaillerie) - Part 2"
          }, {
            "id" : 3299,
            "name" : "Validate Sub-menu for Health & Beauty (Santé & beauté)"
          }, {
            "id" : 3300,
            "name" : "Validate Sub-menu for Health & Beauty (Santé & Beauté) - Part 2"
          }, {
            "id" : 3301,
            "name" : "Validate Sub-menu for Clothing (Vêtements)"
          } ]
        }, {
          "id" : 751,
          "name" : "02_Validate All Menu and sub-menu Activity",
          "steps" : [ {
            "id" : 3302,
            "name" : "Validate menu roll down for Activity"
          }, {
            "id" : 3303,
            "name" : "Validate menu for shop by Activity"
          }, {
            "id" : 3304,
            "name" : "Validate Sub-menu Offices (Bureaux)"
          }, {
            "id" : 3305,
            "name" : "Validate Sub-menu Schools (Écoles)"
          }, {
            "id" : 3306,
            "name" : "Validate Sub-menu Maintenance (Entretien général)"
          }, {
            "id" : 3307,
            "name" : "Validate Sub-menu Maintenance (Entretien général) - Part 2"
          }, {
            "id" : 3308,
            "name" : "Validate Sub-menu Event, Party & Wedding Planning (Événements, fêtes et organisation de mariages)"
          }, {
            "id" : 3309,
            "name" : "Validate Sub-menu EPWP (Événements, fêtes et organisation de mariages) - Part 2"
          }, {
            "id" : 3310,
            "name" : "Validate Sub-menu Hospital & Care Facilities (Hôpitaux et établissements de soins)"
          }, {
            "id" : 3311,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels (Traiteurs, restaurants et hôtels)"
          }, {
            "id" : 3312,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels (Traiteurs, restaurants et hôtels) - Part 2"
          } ]
        } ]
      }, {
        "id" : 397,
        "name" : "05_Validate Filter",
        "scenarios" : [ {
          "id" : 752,
          "name" : "01_Validate Filter Department",
          "steps" : [ {
            "id" : 3313,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 3314,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 3315,
            "name" : "03_Validate Filter by Brand (Marque)"
          }, {
            "id" : 3316,
            "name" : "04_Validate Filter by Unit Price (Prix unitaire)"
          }, {
            "id" : 3317,
            "name" : "05_Validate Many Filter Same time"
          } ]
        }, {
          "id" : 753,
          "name" : "02_Validate Filter Activity",
          "steps" : [ {
            "id" : 3318,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 3319,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 3320,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 3321,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 3322,
            "name" : "05_Validate Many Filters Same time"
          } ]
        } ]
      }, {
        "id" : 398,
        "name" : "06_Validate Short",
        "scenarios" : [ {
          "id" : 754,
          "name" : "01_Validate Short Department",
          "steps" : [ {
            "id" : 3323,
            "name" : "01_Validate Price per case Low to High"
          }, {
            "id" : 3324,
            "name" : "02_Validate Price per case High to Low"
          }, {
            "id" : 3325,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 3326,
            "name" : "04_Validatre Name Z to A"
          }, {
            "id" : 3327,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 3328,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        }, {
          "id" : 755,
          "name" : "02_Validate Short Activity",
          "steps" : [ {
            "id" : 3329,
            "name" : "01_Validate price per Case Low to High"
          }, {
            "id" : 3330,
            "name" : "02_Validate price per Case High to Low"
          }, {
            "id" : 3331,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 3332,
            "name" : "04_Validatre Name Z to A"
          }, {
            "id" : 3333,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 3334,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        } ]
      }, {
        "id" : 399,
        "name" : "07_Validate Article Page Content",
        "scenarios" : [ {
          "id" : 756,
          "name" : "01_Validate Department Article Page",
          "steps" : [ {
            "id" : 3335,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 3336,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 3337,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 3338,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 3339,
            "name" : "05_Validate Article title"
          }, {
            "id" : 3340,
            "name" : "06_Validate You may also like"
          } ]
        }, {
          "id" : 757,
          "name" : "02_Validate Activity Article Page",
          "steps" : [ {
            "id" : 3341,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 3342,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 3343,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 3344,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 3345,
            "name" : "05_Validate Article title"
          }, {
            "id" : 3346,
            "name" : "06_Validate You may also like"
          } ]
        } ]
      }, {
        "id" : 400,
        "name" : "08_Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 758,
          "name" : "01_UnMap And Delete Directory",
          "steps" : [ {
            "id" : 3347,
            "name" : "01_Log To UnMap"
          }, {
            "id" : 3348,
            "name" : "02_Un Map and Delete The Directory On Server And Virtual Machine"
          } ]
        }, {
          "id" : 759,
          "name" : "02_Close browser",
          "steps" : [ {
            "id" : 3349,
            "name" : "01_Logging of the Teardown"
          }, {
            "id" : 3350,
            "name" : "02_Close browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 71,
      "name" : "01_DWS (Desktop Product Catalog Firefox FR)",
      "functionalities" : [ {
        "id" : 425,
        "name" : "01_Setting Of Selenium, Browser And Variables",
        "scenarios" : [ {
          "id" : 808,
          "name" : "01_Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 3593,
            "name" : "01_Setting Variables (Data Repository)"
          }, {
            "id" : 3594,
            "name" : "02_Log for Data Repository"
          } ]
        }, {
          "id" : 809,
          "name" : "02_Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 3595,
            "name" : "01_Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 3596,
            "name" : "02_Logging of Setting Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 810,
          "name" : "03_Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 3597,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub"
          }, {
            "id" : 3598,
            "name" : "02_Log When Browser is opened"
          } ]
        } ]
      }, {
        "id" : 426,
        "name" : "02_Set Language French",
        "scenarios" : [ {
          "id" : 811,
          "name" : "01_Set Language French",
          "steps" : [ {
            "id" : 3599,
            "name" : "01_Set Language French"
          } ]
        } ]
      }, {
        "id" : 427,
        "name" : "03_Validate Content validation and Browse articles from home page",
        "scenarios" : [ {
          "id" : 812,
          "name" : "01_Validate Home Page",
          "steps" : [ {
            "id" : 3600,
            "name" : "01_Validate Sticky header"
          }, {
            "id" : 3601,
            "name" : "02_Validate Start shopping Button on Banner and the Shop now"
          } ]
        }, {
          "id" : 813,
          "name" : "02_Validate Header",
          "steps" : [ {
            "id" : 3602,
            "name" : "01_Validate Top Middle - Header"
          }, {
            "id" : 3603,
            "name" : "02_Validate Low - Header"
          } ]
        } ]
      }, {
        "id" : 428,
        "name" : "04_Validate Shop By Activity and Department - menu & sub-menu items",
        "scenarios" : [ {
          "id" : 814,
          "name" : "01_Validate All menu and sub-menu for Departments",
          "steps" : [ {
            "id" : 3604,
            "name" : "Validate menu for shop by Department"
          }, {
            "id" : 3605,
            "name" : "Validate Sub-menu for Food (Alimentation)"
          }, {
            "id" : 3606,
            "name" : "Validate Sub-menu for Pets (Animaux)"
          }, {
            "id" : 3607,
            "name" : "Validate Sub-menu for Pets (Animaux) - Part 2"
          }, {
            "id" : 3608,
            "name" : "Validate Sub-menu for Party (Célébrations)"
          }, {
            "id" : 3609,
            "name" : "Validate Sub-menu for Party (Célébrations) - Part 2"
          }, {
            "id" : 3610,
            "name" : "Validate Sub-menu for Kitchen (Cuisine)"
          }, {
            "id" : 3611,
            "name" : "Validate Sub-menu for Kitchen (Cuisine) - Part 2"
          }, {
            "id" : 3612,
            "name" : "Validate Sub-menu for Electronics (Électronique)"
          }, {
            "id" : 3613,
            "name" : "Validate Sub-menu for Electronics (Électronique) - Part 2"
          }, {
            "id" : 3614,
            "name" : "Validate Sub-menu for Office (Fournitures de bureau)"
          }, {
            "id" : 3615,
            "name" : "Validate Sub-menu for Office (Fournitures de bureau) - Part 2"
          }, {
            "id" : 3616,
            "name" : "Validate Sub-menu for Toys (Jouets)"
          }, {
            "id" : 3617,
            "name" : "Validate Sub-menu for Home Decor (Maison)"
          }, {
            "id" : 3618,
            "name" : "Validate Sub-menu for Home Decor (Maison) - Part 2"
          }, {
            "id" : 3619,
            "name" : "Validate Sub-menu for Cleaning (Produits ménagers)"
          }, {
            "id" : 3620,
            "name" : "Validate Sub-menu for Cleaning (Produits ménagers) - Part 2"
          }, {
            "id" : 3621,
            "name" : "Validate Sub-menu for Hardware (Quincaillerie)"
          }, {
            "id" : 3622,
            "name" : "Validate Sub-menu for Cleaning (Quincaillerie) - Part 2"
          }, {
            "id" : 3623,
            "name" : "Validate Sub-menu for Health & Beauty (Santé & beauté)"
          }, {
            "id" : 3624,
            "name" : "Validate Sub-menu for Health & Beauty (Santé & Beauté) - Part 2"
          }, {
            "id" : 3625,
            "name" : "Validate Sub-menu for Clothing (Vêtements)"
          } ]
        }, {
          "id" : 815,
          "name" : "02_Validate All Menu and sub-menu Activity",
          "steps" : [ {
            "id" : 3626,
            "name" : "Validate menu roll down for Activity"
          }, {
            "id" : 3627,
            "name" : "Validate menu for shop by Activity"
          }, {
            "id" : 3628,
            "name" : "Validate Sub-menu Offices (Bureaux)"
          }, {
            "id" : 3629,
            "name" : "Validate Sub-menu Schools (Écoles)"
          }, {
            "id" : 3630,
            "name" : "Validate Sub-menu Maintenance (Entretien général)"
          }, {
            "id" : 3631,
            "name" : "Validate Sub-menu Maintenance (Entretien général) - Part 2"
          }, {
            "id" : 3632,
            "name" : "Validate Sub-menu Event, Party & Wedding Planning (Événements, fêtes et organisation de mariages)"
          }, {
            "id" : 3633,
            "name" : "Validate Sub-menu EPWP (Événements, fêtes et organisation de mariages) - Part 2"
          }, {
            "id" : 3634,
            "name" : "Validate Sub-menu Hospital & Care Facilities (Hôpitaux et établissements de soins)"
          }, {
            "id" : 3635,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels (Traiteurs, restaurants et hôtels)"
          }, {
            "id" : 3636,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels (Traiteurs, restaurants et hôtels) - Part 2"
          } ]
        } ]
      }, {
        "id" : 429,
        "name" : "05_Validate Filter",
        "scenarios" : [ {
          "id" : 816,
          "name" : "01_Validate Filter Department",
          "steps" : [ {
            "id" : 3637,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 3638,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 3639,
            "name" : "03_Validate Filter by Brand (Marque)"
          }, {
            "id" : 3640,
            "name" : "04_Validate Filter by Unit Price (Prix unitaire)"
          }, {
            "id" : 3641,
            "name" : "05_Validate Many Filter Same time"
          } ]
        }, {
          "id" : 817,
          "name" : "02_Validate Filter Activity",
          "steps" : [ {
            "id" : 3642,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 3643,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 3644,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 3645,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 3646,
            "name" : "05_Validate Many Filters Same time"
          } ]
        } ]
      }, {
        "id" : 430,
        "name" : "06_Validate Short",
        "scenarios" : [ {
          "id" : 818,
          "name" : "01_Validate Short Department",
          "steps" : [ {
            "id" : 3647,
            "name" : "01_Validate Price per case Low to High"
          }, {
            "id" : 3648,
            "name" : "02_Validate Price per case High to Low"
          }, {
            "id" : 3649,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 3650,
            "name" : "04_Validatre Name Z to A"
          }, {
            "id" : 3651,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 3652,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        }, {
          "id" : 819,
          "name" : "02_Validate Short Activity",
          "steps" : [ {
            "id" : 3653,
            "name" : "01_Validate price per Case Low to High"
          }, {
            "id" : 3654,
            "name" : "02_Validate price per Case High to Low"
          }, {
            "id" : 3655,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 3656,
            "name" : "04_Validatre Name Z to A"
          }, {
            "id" : 3657,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 3658,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        } ]
      }, {
        "id" : 431,
        "name" : "07_Validate Article Page Content",
        "scenarios" : [ {
          "id" : 820,
          "name" : "01_Validate Department Article Page",
          "steps" : [ {
            "id" : 3659,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 3660,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 3661,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 3662,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 3663,
            "name" : "05_Validate Article title"
          }, {
            "id" : 3664,
            "name" : "06_Validate You may also like"
          } ]
        }, {
          "id" : 821,
          "name" : "02_Validate Activity Article Page",
          "steps" : [ {
            "id" : 3665,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 3666,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 3667,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 3668,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 3669,
            "name" : "05_Validate Article title"
          }, {
            "id" : 3670,
            "name" : "06_Validate You may also like"
          } ]
        } ]
      }, {
        "id" : 432,
        "name" : "08_Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 822,
          "name" : "01_UnMap And Delete Directory",
          "steps" : [ {
            "id" : 3671,
            "name" : "01_Log To UnMap"
          }, {
            "id" : 3672,
            "name" : "02_Un Map and Delete The Directory On Server And Virtual Machine"
          } ]
        }, {
          "id" : 823,
          "name" : "02_Close browser",
          "steps" : [ {
            "id" : 3673,
            "name" : "01_Logging of the Teardown"
          }, {
            "id" : 3674,
            "name" : "02_Close browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 75,
      "name" : "01_DWS (Desktop Product Catalog IE FR)",
      "functionalities" : [ {
        "id" : 454,
        "name" : "01_Setting Of Selenium, Browser And Variables",
        "scenarios" : [ {
          "id" : 857,
          "name" : "01_Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 3842,
            "name" : "01_Setting Variables (Data Repository)"
          }, {
            "id" : 3843,
            "name" : "02_Log for Data Repository"
          } ]
        }, {
          "id" : 858,
          "name" : "02_Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 3844,
            "name" : "01_Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 3845,
            "name" : "02_Logging of Setting Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 859,
          "name" : "03_Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 3846,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub"
          }, {
            "id" : 4730,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub amira"
          }, {
            "id" : 3847,
            "name" : "02_Log When Browser is opened"
          } ]
        } ]
      }, {
        "id" : 455,
        "name" : "02_Set Language French",
        "scenarios" : [ {
          "id" : 860,
          "name" : "01_Set Language French",
          "steps" : [ {
            "id" : 3848,
            "name" : "01_Set Language French"
          } ]
        } ]
      }, {
        "id" : 456,
        "name" : "03_Validate Content validation and Browse articles from home page",
        "scenarios" : [ {
          "id" : 861,
          "name" : "01_Validate Home Page",
          "steps" : [ {
            "id" : 3849,
            "name" : "01_Validate Sticky header"
          }, {
            "id" : 3850,
            "name" : "02_Validate Start shopping Button on Banner and the Shop now"
          } ]
        }, {
          "id" : 862,
          "name" : "02_Validate Header",
          "steps" : [ {
            "id" : 3851,
            "name" : "01_Validate Top Middle - Header"
          }, {
            "id" : 3852,
            "name" : "02_Validate Low - Header"
          } ]
        } ]
      }, {
        "id" : 457,
        "name" : "04_Validate Shop By Activity and Department - menu & sub-menu items",
        "scenarios" : [ {
          "id" : 863,
          "name" : "01_Validate All menu and sub-menu for Departments",
          "steps" : [ {
            "id" : 3853,
            "name" : "Validate menu for shop by Department"
          }, {
            "id" : 3854,
            "name" : "Validate Sub-menu for Food (Alimentation)"
          }, {
            "id" : 3855,
            "name" : "Validate Sub-menu for Pets (Animaux)"
          }, {
            "id" : 3856,
            "name" : "Validate Sub-menu for Pets (Animaux) - Part 2"
          }, {
            "id" : 3857,
            "name" : "Validate Sub-menu for Party (Célébrations)"
          }, {
            "id" : 3858,
            "name" : "Validate Sub-menu for Party (Célébrations) - Part 2"
          }, {
            "id" : 3859,
            "name" : "Validate Sub-menu for Kitchen (Cuisine)"
          }, {
            "id" : 3860,
            "name" : "Validate Sub-menu for Kitchen (Cuisine) - Part 2"
          }, {
            "id" : 3861,
            "name" : "Validate Sub-menu for Electronics (Électronique)"
          }, {
            "id" : 3862,
            "name" : "Validate Sub-menu for Electronics (Électronique) - Part 2"
          }, {
            "id" : 3863,
            "name" : "Validate Sub-menu for Office (Fournitures de bureau)"
          }, {
            "id" : 3864,
            "name" : "Validate Sub-menu for Office (Fournitures de bureau) - Part 2"
          }, {
            "id" : 3865,
            "name" : "Validate Sub-menu for Toys (Jouets)"
          }, {
            "id" : 3866,
            "name" : "Validate Sub-menu for Home Decor (Maison)"
          }, {
            "id" : 3867,
            "name" : "Validate Sub-menu for Home Decor (Maison) - Part 2"
          }, {
            "id" : 3868,
            "name" : "Validate Sub-menu for Cleaning (Produits ménagers)"
          }, {
            "id" : 3869,
            "name" : "Validate Sub-menu for Cleaning (Produits ménagers) - Part 2"
          }, {
            "id" : 3870,
            "name" : "Validate Sub-menu for Hardware (Quincaillerie)"
          }, {
            "id" : 3871,
            "name" : "Validate Sub-menu for Cleaning (Quincaillerie) - Part 2"
          }, {
            "id" : 3872,
            "name" : "Validate Sub-menu for Health & Beauty (Santé & beauté)"
          }, {
            "id" : 3873,
            "name" : "Validate Sub-menu for Health & Beauty (Santé & Beauté) - Part 2"
          }, {
            "id" : 3874,
            "name" : "Validate Sub-menu for Clothing (Vêtements)"
          } ]
        }, {
          "id" : 864,
          "name" : "02_Validate All Menu and sub-menu Activity",
          "steps" : [ {
            "id" : 3875,
            "name" : "Validate menu roll down for Activity"
          }, {
            "id" : 3876,
            "name" : "Validate menu for shop by Activity"
          }, {
            "id" : 3877,
            "name" : "Validate Sub-menu Offices (Bureaux)"
          }, {
            "id" : 3878,
            "name" : "Validate Sub-menu Schools (Écoles)"
          }, {
            "id" : 3879,
            "name" : "Validate Sub-menu Maintenance (Entretien général)"
          }, {
            "id" : 3880,
            "name" : "Validate Sub-menu Maintenance (Entretien général) - Part 2"
          }, {
            "id" : 3881,
            "name" : "Validate Sub-menu Event, Party & Wedding Planning (Événements, fêtes et organisation de mariages)"
          }, {
            "id" : 3882,
            "name" : "Validate Sub-menu EPWP (Événements, fêtes et organisation de mariages) - Part 2"
          }, {
            "id" : 3883,
            "name" : "Validate Sub-menu Hospital & Care Facilities (Hôpitaux et établissements de soins)"
          }, {
            "id" : 3884,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels (Traiteurs, restaurants et hôtels)"
          }, {
            "id" : 3885,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels (Traiteurs, restaurants et hôtels) - Part 2"
          } ]
        } ]
      }, {
        "id" : 458,
        "name" : "05_Validate Filter",
        "scenarios" : [ {
          "id" : 865,
          "name" : "01_Validate Filter Department",
          "steps" : [ {
            "id" : 3886,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 3887,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 3888,
            "name" : "03_Validate Filter by Brand (Marque)"
          }, {
            "id" : 3889,
            "name" : "04_Validate Filter by Unit Price (Prix unitaire)"
          }, {
            "id" : 3890,
            "name" : "05_Validate Many Filter Same time"
          } ]
        }, {
          "id" : 866,
          "name" : "02_Validate Filter Activity",
          "steps" : [ {
            "id" : 3891,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 3892,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 3893,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 3894,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 3895,
            "name" : "05_Validate Many Filters Same time"
          } ]
        } ]
      }, {
        "id" : 459,
        "name" : "06_Validate Short",
        "scenarios" : [ {
          "id" : 867,
          "name" : "01_Validate Short Department",
          "steps" : [ {
            "id" : 3896,
            "name" : "01_Validate Price per case Low to High"
          }, {
            "id" : 3897,
            "name" : "02_Validate Price per case High to Low"
          }, {
            "id" : 3898,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 3899,
            "name" : "04_Validatre Name Z to A"
          }, {
            "id" : 3900,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 3901,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        }, {
          "id" : 868,
          "name" : "02_Validate Short Activity",
          "steps" : [ {
            "id" : 3902,
            "name" : "01_Validate price per Case Low to High"
          }, {
            "id" : 3903,
            "name" : "02_Validate price per Case High to Low"
          }, {
            "id" : 3904,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 3905,
            "name" : "04_Validatre Name Z to A"
          }, {
            "id" : 3906,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 3907,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        } ]
      }, {
        "id" : 460,
        "name" : "07_Validate Article Page Content",
        "scenarios" : [ {
          "id" : 869,
          "name" : "01_Validate Department Article Page",
          "steps" : [ {
            "id" : 3908,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 3909,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 3910,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 3911,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 3912,
            "name" : "05_Validate Article title"
          }, {
            "id" : 3913,
            "name" : "06_Validate You may also like"
          } ]
        }, {
          "id" : 870,
          "name" : "02_Validate Activity Article Page",
          "steps" : [ {
            "id" : 3914,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 3915,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 3916,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 3917,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 3918,
            "name" : "05_Validate Article title"
          }, {
            "id" : 3919,
            "name" : "06_Validate You may also like"
          } ]
        } ]
      }, {
        "id" : 461,
        "name" : "08_Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 871,
          "name" : "01_UnMap And Delete Directory",
          "steps" : [ {
            "id" : 3920,
            "name" : "01_Log To UnMap"
          }, {
            "id" : 3921,
            "name" : "02_Un Map and Delete The Directory On Server And Virtual Machine"
          } ]
        }, {
          "id" : 872,
          "name" : "02_Close browser",
          "steps" : [ {
            "id" : 3922,
            "name" : "01_Logging of the Teardown"
          }, {
            "id" : 3923,
            "name" : "02_Close browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 76,
      "name" : "01_DWS (Desktop Product Catalog Safari FR 3 To 4)",
      "functionalities" : [ {
        "id" : 462,
        "name" : "01_Setting Of Selenium, Browser And Variables",
        "scenarios" : [ {
          "id" : 873,
          "name" : "01_Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 3924,
            "name" : "01_Setting Variables (Data Repository)"
          }, {
            "id" : 3925,
            "name" : "02_Log for Data Repository"
          } ]
        }, {
          "id" : 874,
          "name" : "02_Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 3926,
            "name" : "01_Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 3927,
            "name" : "02_Logging of Setting Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 875,
          "name" : "03_Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 3928,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub"
          }, {
            "id" : 3929,
            "name" : "02_Log When Browser is opened"
          } ]
        } ]
      }, {
        "id" : 463,
        "name" : "02_Set Language French",
        "scenarios" : [ {
          "id" : 876,
          "name" : "01_Set Language French",
          "steps" : [ {
            "id" : 3930,
            "name" : "01_Set Language French"
          } ]
        } ]
      }, {
        "id" : 464,
        "name" : "03_Validate Content validation and Browse articles from home page",
        "scenarios" : [ {
          "id" : 877,
          "name" : "01_Validate Home Page",
          "steps" : [ {
            "id" : 3931,
            "name" : "01_Validate Sticky header"
          }, {
            "id" : 3932,
            "name" : "02_Validate Start shopping Button on Banner and the Shop now"
          } ]
        }, {
          "id" : 878,
          "name" : "02_Validate Header",
          "steps" : [ {
            "id" : 3933,
            "name" : "01_Validate Top Middle - Header"
          }, {
            "id" : 3934,
            "name" : "02_Validate Low - Header"
          } ]
        } ]
      }, {
        "id" : 465,
        "name" : "04_Validate Shop By Activity and Department - menu & sub-menu items",
        "scenarios" : [ {
          "id" : 879,
          "name" : "01_Validate All menu and sub-menu for Departments",
          "steps" : [ {
            "id" : 3935,
            "name" : "Validate menu for shop by Department"
          }, {
            "id" : 3936,
            "name" : "Validate Sub-menu for Food (Alimentation)"
          }, {
            "id" : 3937,
            "name" : "Validate Sub-menu for Pets (Animaux)"
          }, {
            "id" : 3938,
            "name" : "Validate Sub-menu for Pets (Animaux) - Part 2"
          }, {
            "id" : 3939,
            "name" : "Validate Sub-menu for Party (Célébrations)"
          }, {
            "id" : 3940,
            "name" : "Validate Sub-menu for Party (Célébrations) - Part 2"
          }, {
            "id" : 3941,
            "name" : "Validate Sub-menu for Kitchen (Cuisine)"
          }, {
            "id" : 3942,
            "name" : "Validate Sub-menu for Kitchen (Cuisine) - Part 2"
          }, {
            "id" : 3943,
            "name" : "Validate Sub-menu for Electronics (Électronique)"
          }, {
            "id" : 3944,
            "name" : "Validate Sub-menu for Electronics (Électronique) - Part 2"
          }, {
            "id" : 3945,
            "name" : "Validate Sub-menu for Office (Fournitures de bureau)"
          }, {
            "id" : 3946,
            "name" : "Validate Sub-menu for Office (Fournitures de bureau) - Part 2"
          }, {
            "id" : 3947,
            "name" : "Validate Sub-menu for Toys (Jouets)"
          }, {
            "id" : 3948,
            "name" : "Validate Sub-menu for Home Decor (Maison)"
          }, {
            "id" : 3949,
            "name" : "Validate Sub-menu for Home Decor (Maison) - Part 2"
          }, {
            "id" : 3950,
            "name" : "Validate Sub-menu for Cleaning (Produits ménagers)"
          }, {
            "id" : 3951,
            "name" : "Validate Sub-menu for Cleaning (Produits ménagers) - Part 2"
          }, {
            "id" : 3952,
            "name" : "Validate Sub-menu for Hardware (Quincaillerie)"
          }, {
            "id" : 3953,
            "name" : "Validate Sub-menu for Cleaning (Quincaillerie) - Part 2"
          }, {
            "id" : 3954,
            "name" : "Validate Sub-menu for Health & Beauty (Santé & beauté)"
          }, {
            "id" : 3955,
            "name" : "Validate Sub-menu for Health & Beauty (Santé & Beauté) - Part 2"
          }, {
            "id" : 3956,
            "name" : "Validate Sub-menu for Clothing (Vêtements)"
          } ]
        }, {
          "id" : 880,
          "name" : "02_Validate All Menu and sub-menu Activity",
          "steps" : [ {
            "id" : 3957,
            "name" : "Validate menu roll down for Activity"
          }, {
            "id" : 3958,
            "name" : "Validate menu for shop by Activity"
          }, {
            "id" : 3959,
            "name" : "Validate Sub-menu Offices (Bureaux)"
          }, {
            "id" : 3960,
            "name" : "Validate Sub-menu Schools (Écoles)"
          }, {
            "id" : 3961,
            "name" : "Validate Sub-menu Maintenance (Entretien général)"
          }, {
            "id" : 3962,
            "name" : "Validate Sub-menu Maintenance (Entretien général) - Part 2"
          }, {
            "id" : 3963,
            "name" : "Validate Sub-menu Event, Party & Wedding Planning (Événements, fêtes et organisation de mariages)"
          }, {
            "id" : 3964,
            "name" : "Validate Sub-menu EPWP (Événements, fêtes et organisation de mariages) - Part 2"
          }, {
            "id" : 3965,
            "name" : "Validate Sub-menu Hospital & Care Facilities (Hôpitaux et établissements de soins)"
          }, {
            "id" : 3966,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels (Traiteurs, restaurants et hôtels)"
          }, {
            "id" : 3967,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels (Traiteurs, restaurants et hôtels) - Part 2"
          } ]
        } ]
      }, {
        "id" : 466,
        "name" : "05_Validate Filter",
        "scenarios" : [ {
          "id" : 881,
          "name" : "01_Validate Filter Department",
          "steps" : [ {
            "id" : 3968,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 3969,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 3970,
            "name" : "03_Validate Filter by Brand (Marque)"
          }, {
            "id" : 3971,
            "name" : "04_Validate Filter by Unit Price (Prix unitaire)"
          }, {
            "id" : 3972,
            "name" : "05_Validate Many Filter Same time"
          } ]
        }, {
          "id" : 882,
          "name" : "02_Validate Filter Activity",
          "steps" : [ {
            "id" : 3973,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 3974,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 3975,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 3976,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 3977,
            "name" : "05_Validate Many Filters Same time"
          } ]
        } ]
      }, {
        "id" : 467,
        "name" : "06_Validate Short",
        "scenarios" : [ {
          "id" : 883,
          "name" : "01_Validate Short Department",
          "steps" : [ {
            "id" : 3978,
            "name" : "01_Validate Price per case Low to High"
          }, {
            "id" : 3979,
            "name" : "02_Validate Price per case High to Low"
          }, {
            "id" : 3980,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 3981,
            "name" : "04_Validatre Name Z to A"
          }, {
            "id" : 3982,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 3983,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        }, {
          "id" : 884,
          "name" : "02_Validate Short Activity",
          "steps" : [ {
            "id" : 3984,
            "name" : "01_Validate price per Case Low to High"
          }, {
            "id" : 3985,
            "name" : "02_Validate price per Case High to Low"
          }, {
            "id" : 3986,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 3987,
            "name" : "04_Validatre Name Z to A"
          }, {
            "id" : 3988,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 3989,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        } ]
      }, {
        "id" : 468,
        "name" : "07_Validate Article Page Content",
        "scenarios" : [ {
          "id" : 885,
          "name" : "01_Validate Department Article Page",
          "steps" : [ {
            "id" : 3990,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 3991,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 3992,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 3993,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 3994,
            "name" : "05_Validate Article title"
          }, {
            "id" : 3995,
            "name" : "06_Validate You may also like"
          } ]
        }, {
          "id" : 886,
          "name" : "02_Validate Activity Article Page",
          "steps" : [ {
            "id" : 3996,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 3997,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 3998,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 3999,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 4000,
            "name" : "05_Validate Article title"
          }, {
            "id" : 4001,
            "name" : "06_Validate You may also like"
          } ]
        } ]
      }, {
        "id" : 469,
        "name" : "08_Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 887,
          "name" : "01_UnMap And Delete Directory",
          "steps" : [ {
            "id" : 4002,
            "name" : "01_Log To UnMap"
          }, {
            "id" : 4003,
            "name" : "02_Un Map and Delete The Directory On Server And Virtual Machine"
          } ]
        }, {
          "id" : 888,
          "name" : "02_Close browser",
          "steps" : [ {
            "id" : 4004,
            "name" : "01_Logging of the Teardown"
          }, {
            "id" : 4005,
            "name" : "02_Close browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 72,
      "name" : "01_DWS (Desktop Product Catalog Safari EN)",
      "functionalities" : [ {
        "id" : 433,
        "name" : "01_Setting Of Selenium, Browser And Variables",
        "scenarios" : [ {
          "id" : 824,
          "name" : "01_Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 3675,
            "name" : "01_Setting Variables (Data Repository)"
          }, {
            "id" : 3676,
            "name" : "02_Log for Data Repository"
          } ]
        }, {
          "id" : 825,
          "name" : "02_Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 3677,
            "name" : "01_Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 3678,
            "name" : "02_Logging of Setting Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 826,
          "name" : "03_Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 3679,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub"
          }, {
            "id" : 3680,
            "name" : "02_Log When Browser is opened"
          } ]
        } ]
      }, {
        "id" : 434,
        "name" : "02_Set Language English",
        "scenarios" : [ {
          "id" : 827,
          "name" : "01_Set Language English",
          "steps" : [ {
            "id" : 3681,
            "name" : "01_Set Language English"
          } ]
        } ]
      }, {
        "id" : 436,
        "name" : "04_Validate Shop By Activity and Department - menu & sub-menu items",
        "scenarios" : [ {
          "id" : 830,
          "name" : "01_Validate All menu and sub-menu for Departments",
          "steps" : [ {
            "id" : 3686,
            "name" : "Validate Sub-menu for Cleaning"
          }, {
            "id" : 3687,
            "name" : "Validate Sub-menu for Clothing"
          }, {
            "id" : 3688,
            "name" : "Validate Sub-menu for Electronics"
          }, {
            "id" : 3689,
            "name" : "Validate Sub-menu for Food"
          }, {
            "id" : 3690,
            "name" : "Validate Sub-menu for Hardware"
          }, {
            "id" : 3691,
            "name" : "Validate Sub-menu for Health & Beauty"
          }, {
            "id" : 3692,
            "name" : "Validate Sub-menu for Home Decor"
          }, {
            "id" : 3693,
            "name" : "Validate Sub-menu for Kitchen"
          }, {
            "id" : 3694,
            "name" : "Validate Sub-menu for Kitchen (part 2 - Kitchen_Basics)"
          }, {
            "id" : 3695,
            "name" : "Validate Sub-menu for Office"
          }, {
            "id" : 3696,
            "name" : "Validate Sub-menu for Party"
          }, {
            "id" : 3697,
            "name" : "Validate Sub-menu for Pets"
          }, {
            "id" : 3698,
            "name" : "Validate Sub-menu for Toys"
          } ]
        }, {
          "id" : 831,
          "name" : "02_Validate All Menu and sub-menu Activity",
          "steps" : [ {
            "id" : 3699,
            "name" : "Validate menu roll down for Activity"
          }, {
            "id" : 3700,
            "name" : "Validate menu for shop by Activity"
          }, {
            "id" : 3701,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels"
          }, {
            "id" : 3702,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels (part 2)"
          }, {
            "id" : 3703,
            "name" : "Validate Sub-menu Event, Party & Wedding Planning"
          }, {
            "id" : 3704,
            "name" : "Validate Sub-menu Event, Party & Wedding Planning (part 2)"
          }, {
            "id" : 3705,
            "name" : "Validate Sub-menu Hospital & Care Facilities"
          }, {
            "id" : 3706,
            "name" : "Validate Sub-menu Hospital & Care Facilities (part 2)"
          }, {
            "id" : 3707,
            "name" : "Validate Sub-menu Maintenance"
          }, {
            "id" : 3708,
            "name" : "Validate Sub-menu Maintenance (part 2)"
          }, {
            "id" : 3709,
            "name" : "Validate Sub-menu Offices"
          }, {
            "id" : 3710,
            "name" : "Validate Sub-menu Offices (part 2)"
          }, {
            "id" : 3711,
            "name" : "Validate Sub-menu Schools"
          }, {
            "id" : 3712,
            "name" : "Validate Sub-menu Schools (part 2)"
          } ]
        } ]
      }, {
        "id" : 437,
        "name" : "05_Validate Filter",
        "scenarios" : [ {
          "id" : 832,
          "name" : "01_Validate Filter Department",
          "steps" : [ {
            "id" : 3713,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 3714,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 3715,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 3716,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 3717,
            "name" : "05_Validate Many Filter Same time"
          } ]
        }, {
          "id" : 833,
          "name" : "02_Validate Filter Activity",
          "steps" : [ {
            "id" : 3718,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 3719,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 3720,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 3721,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 3722,
            "name" : "05_Validate Many Filters Same time"
          } ]
        } ]
      }, {
        "id" : 438,
        "name" : "06_Validate Short",
        "scenarios" : [ {
          "id" : 834,
          "name" : "01_Validate Short Department",
          "steps" : [ {
            "id" : 3723,
            "name" : "01_Validate Price per case Low to High"
          }, {
            "id" : 3724,
            "name" : "02_Validate Price per case High to Low"
          }, {
            "id" : 3725,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 3726,
            "name" : "04_Validatre Name Z to A"
          }, {
            "id" : 3727,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 3728,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        }, {
          "id" : 835,
          "name" : "02_Validate Short Activity",
          "steps" : [ {
            "id" : 3729,
            "name" : "01_Validate price per Case Low to High"
          }, {
            "id" : 3730,
            "name" : "02_Validate price per Case High to Low"
          }, {
            "id" : 3731,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 3732,
            "name" : "04_Validatre Name Z to A"
          }, {
            "id" : 3733,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 3734,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        } ]
      }, {
        "id" : 439,
        "name" : "07_Validate Article Page Content",
        "scenarios" : [ {
          "id" : 836,
          "name" : "01_Validate Department Article Page",
          "steps" : [ {
            "id" : 3735,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 3736,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 3737,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 3738,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 3739,
            "name" : "05_Validate Article title"
          }, {
            "id" : 3740,
            "name" : "06_Validate You may also like"
          } ]
        }, {
          "id" : 837,
          "name" : "02_Validate Activity Article Page",
          "steps" : [ {
            "id" : 3741,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 3742,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 3743,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 3744,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 3745,
            "name" : "05_Validate Article title"
          }, {
            "id" : 3746,
            "name" : "06_Validate You may also like"
          } ]
        } ]
      }, {
        "id" : 435,
        "name" : "03_Validate Content validation and Browse articles from home page",
        "scenarios" : [ {
          "id" : 828,
          "name" : "01_Validate Home Page",
          "steps" : [ {
            "id" : 3682,
            "name" : "01_Validate Sticky header"
          }, {
            "id" : 3683,
            "name" : "02_Validate Start shopping Button on Banner and the Shop now"
          } ]
        }, {
          "id" : 829,
          "name" : "02_Validate Header",
          "steps" : [ {
            "id" : 3684,
            "name" : "01_Validate Top Middle - Header"
          }, {
            "id" : 3685,
            "name" : "02_Validate Low - Header"
          } ]
        } ]
      }, {
        "id" : 440,
        "name" : "08_Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 838,
          "name" : "01_UnMap And Delete Directory",
          "steps" : [ {
            "id" : 3747,
            "name" : "01_Log To UnMap"
          }, {
            "id" : 3748,
            "name" : "02_Un Map and Delete The Directory On Server And Virtual Machine"
          } ]
        }, {
          "id" : 839,
          "name" : "02_Close browser",
          "steps" : [ {
            "id" : 3749,
            "name" : "01_Logging of the Teardown"
          }, {
            "id" : 3750,
            "name" : "02_Close browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 81,
      "name" : "01_DWS (Desktop Product Catalog Safari FR 5 To 6)",
      "functionalities" : [ {
        "id" : 500,
        "name" : "01_Setting Of Selenium, Browser And Variables",
        "scenarios" : [ {
          "id" : 945,
          "name" : "01_Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 4283,
            "name" : "01_Setting Variables (Data Repository)"
          }, {
            "id" : 4284,
            "name" : "02_Log for Data Repository"
          } ]
        }, {
          "id" : 946,
          "name" : "02_Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 4285,
            "name" : "01_Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 4286,
            "name" : "02_Logging of Setting Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 947,
          "name" : "03_Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 4287,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub"
          }, {
            "id" : 4288,
            "name" : "02_Log When Browser is opened"
          } ]
        } ]
      }, {
        "id" : 501,
        "name" : "02_Set Language French",
        "scenarios" : [ {
          "id" : 948,
          "name" : "01_Set Language French",
          "steps" : [ {
            "id" : 4289,
            "name" : "01_Set Language French"
          } ]
        } ]
      }, {
        "id" : 502,
        "name" : "03_Validate Content validation and Browse articles from home page",
        "scenarios" : [ {
          "id" : 949,
          "name" : "01_Validate Home Page",
          "steps" : [ {
            "id" : 4290,
            "name" : "01_Validate Sticky header"
          }, {
            "id" : 4291,
            "name" : "02_Validate Start shopping Button on Banner and the Shop now"
          } ]
        }, {
          "id" : 950,
          "name" : "02_Validate Header",
          "steps" : [ {
            "id" : 4292,
            "name" : "01_Validate Top Middle - Header"
          }, {
            "id" : 4293,
            "name" : "02_Validate Low - Header"
          } ]
        } ]
      }, {
        "id" : 503,
        "name" : "04_Validate Shop By Activity and Department - menu & sub-menu items",
        "scenarios" : [ {
          "id" : 951,
          "name" : "01_Validate All menu and sub-menu for Departments",
          "steps" : [ {
            "id" : 4294,
            "name" : "Validate menu for shop by Department"
          }, {
            "id" : 4295,
            "name" : "Validate Sub-menu for Food (Alimentation)"
          }, {
            "id" : 4296,
            "name" : "Validate Sub-menu for Pets (Animaux)"
          }, {
            "id" : 4297,
            "name" : "Validate Sub-menu for Pets (Animaux) - Part 2"
          }, {
            "id" : 4298,
            "name" : "Validate Sub-menu for Party (Célébrations)"
          }, {
            "id" : 4299,
            "name" : "Validate Sub-menu for Party (Célébrations) - Part 2"
          }, {
            "id" : 4300,
            "name" : "Validate Sub-menu for Kitchen (Cuisine)"
          }, {
            "id" : 4301,
            "name" : "Validate Sub-menu for Kitchen (Cuisine) - Part 2"
          }, {
            "id" : 4302,
            "name" : "Validate Sub-menu for Electronics (Électronique)"
          }, {
            "id" : 4303,
            "name" : "Validate Sub-menu for Electronics (Électronique) - Part 2"
          }, {
            "id" : 4304,
            "name" : "Validate Sub-menu for Office (Fournitures de bureau)"
          }, {
            "id" : 4305,
            "name" : "Validate Sub-menu for Office (Fournitures de bureau) - Part 2"
          }, {
            "id" : 4306,
            "name" : "Validate Sub-menu for Toys (Jouets)"
          }, {
            "id" : 4307,
            "name" : "Validate Sub-menu for Home Decor (Maison)"
          }, {
            "id" : 4308,
            "name" : "Validate Sub-menu for Home Decor (Maison) - Part 2"
          }, {
            "id" : 4309,
            "name" : "Validate Sub-menu for Cleaning (Produits ménagers)"
          }, {
            "id" : 4310,
            "name" : "Validate Sub-menu for Cleaning (Produits ménagers) - Part 2"
          }, {
            "id" : 4311,
            "name" : "Validate Sub-menu for Hardware (Quincaillerie)"
          }, {
            "id" : 4312,
            "name" : "Validate Sub-menu for Cleaning (Quincaillerie) - Part 2"
          }, {
            "id" : 4313,
            "name" : "Validate Sub-menu for Health & Beauty (Santé & beauté)"
          }, {
            "id" : 4314,
            "name" : "Validate Sub-menu for Health & Beauty (Santé & Beauté) - Part 2"
          }, {
            "id" : 4315,
            "name" : "Validate Sub-menu for Clothing (Vêtements)"
          } ]
        }, {
          "id" : 952,
          "name" : "02_Validate All Menu and sub-menu Activity",
          "steps" : [ {
            "id" : 4316,
            "name" : "Validate menu roll down for Activity"
          }, {
            "id" : 4317,
            "name" : "Validate menu for shop by Activity"
          }, {
            "id" : 4318,
            "name" : "Validate Sub-menu Offices (Bureaux)"
          }, {
            "id" : 4319,
            "name" : "Validate Sub-menu Schools (Écoles)"
          }, {
            "id" : 4320,
            "name" : "Validate Sub-menu Maintenance (Entretien général)"
          }, {
            "id" : 4321,
            "name" : "Validate Sub-menu Maintenance (Entretien général) - Part 2"
          }, {
            "id" : 4322,
            "name" : "Validate Sub-menu Event, Party & Wedding Planning (Événements, fêtes et organisation de mariages)"
          }, {
            "id" : 4323,
            "name" : "Validate Sub-menu EPWP (Événements, fêtes et organisation de mariages) - Part 2"
          }, {
            "id" : 4324,
            "name" : "Validate Sub-menu Hospital & Care Facilities (Hôpitaux et établissements de soins)"
          }, {
            "id" : 4325,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels (Traiteurs, restaurants et hôtels)"
          }, {
            "id" : 4326,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels (Traiteurs, restaurants et hôtels) - Part 2"
          } ]
        } ]
      }, {
        "id" : 504,
        "name" : "05_Validate Filter",
        "scenarios" : [ {
          "id" : 953,
          "name" : "01_Validate Filter Department",
          "steps" : [ {
            "id" : 4327,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 4328,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 4329,
            "name" : "03_Validate Filter by Brand (Marque)"
          }, {
            "id" : 4330,
            "name" : "04_Validate Filter by Unit Price (Prix unitaire)"
          }, {
            "id" : 4331,
            "name" : "05_Validate Many Filter Same time"
          } ]
        }, {
          "id" : 954,
          "name" : "02_Validate Filter Activity",
          "steps" : [ {
            "id" : 4332,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 4333,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 4334,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 4335,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 4336,
            "name" : "05_Validate Many Filters Same time"
          } ]
        } ]
      }, {
        "id" : 505,
        "name" : "06_Validate Short",
        "scenarios" : [ {
          "id" : 955,
          "name" : "01_Validate Short Department",
          "steps" : [ {
            "id" : 4337,
            "name" : "01_Validate Price per case Low to High"
          }, {
            "id" : 4338,
            "name" : "02_Validate Price per case High to Low"
          }, {
            "id" : 4339,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 4340,
            "name" : "04_Validatre Name Z to A"
          }, {
            "id" : 4341,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 4342,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        }, {
          "id" : 956,
          "name" : "02_Validate Short Activity",
          "steps" : [ {
            "id" : 4343,
            "name" : "01_Validate price per Case Low to High"
          }, {
            "id" : 4344,
            "name" : "02_Validate price per Case High to Low"
          }, {
            "id" : 4345,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 4346,
            "name" : "04_Validatre Name Z to A"
          }, {
            "id" : 4347,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 4348,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        } ]
      }, {
        "id" : 506,
        "name" : "07_Validate Article Page Content",
        "scenarios" : [ {
          "id" : 957,
          "name" : "01_Validate Department Article Page",
          "steps" : [ {
            "id" : 4349,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 4350,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 4351,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 4352,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 4353,
            "name" : "05_Validate Article title"
          }, {
            "id" : 4354,
            "name" : "06_Validate You may also like"
          } ]
        }, {
          "id" : 958,
          "name" : "02_Validate Activity Article Page",
          "steps" : [ {
            "id" : 4355,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 4356,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 4357,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 4358,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 4359,
            "name" : "05_Validate Article title"
          }, {
            "id" : 4360,
            "name" : "06_Validate You may also like"
          } ]
        } ]
      }, {
        "id" : 507,
        "name" : "08_Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 959,
          "name" : "01_UnMap And Delete Directory",
          "steps" : [ {
            "id" : 4361,
            "name" : "01_Log To UnMap"
          }, {
            "id" : 4362,
            "name" : "02_Un Map and Delete The Directory On Server And Virtual Machine"
          } ]
        }, {
          "id" : 960,
          "name" : "02_Close browser",
          "steps" : [ {
            "id" : 4363,
            "name" : "01_Logging of the Teardown"
          }, {
            "id" : 4364,
            "name" : "02_Close browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 82,
      "name" : "01_DWS (Desktop Product Catalog Safari FR)",
      "functionalities" : [ {
        "id" : 508,
        "name" : "01_Setting Of Selenium, Browser And Variables",
        "scenarios" : [ {
          "id" : 961,
          "name" : "01_Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 4365,
            "name" : "01_Setting Variables (Data Repository)"
          }, {
            "id" : 4366,
            "name" : "02_Log for Data Repository"
          } ]
        }, {
          "id" : 962,
          "name" : "02_Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 4367,
            "name" : "01_Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 4368,
            "name" : "02_Logging of Setting Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 963,
          "name" : "03_Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 4369,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub"
          }, {
            "id" : 4370,
            "name" : "02_Log When Browser is opened"
          } ]
        } ]
      }, {
        "id" : 509,
        "name" : "02_Set Language French",
        "scenarios" : [ {
          "id" : 964,
          "name" : "01_Set Language French",
          "steps" : [ {
            "id" : 4371,
            "name" : "01_Set Language French"
          } ]
        } ]
      }, {
        "id" : 510,
        "name" : "03_Validate Content validation and Browse articles from home page",
        "scenarios" : [ {
          "id" : 965,
          "name" : "01_Validate Home Page",
          "steps" : [ {
            "id" : 4372,
            "name" : "01_Validate Sticky header"
          }, {
            "id" : 4373,
            "name" : "02_Validate Start shopping Button on Banner and the Shop now"
          } ]
        }, {
          "id" : 966,
          "name" : "02_Validate Header",
          "steps" : [ {
            "id" : 4374,
            "name" : "01_Validate Top Middle - Header"
          }, {
            "id" : 4375,
            "name" : "02_Validate Low - Header"
          } ]
        } ]
      }, {
        "id" : 511,
        "name" : "04_Validate Shop By Activity and Department - menu & sub-menu items",
        "scenarios" : [ {
          "id" : 967,
          "name" : "01_Validate All menu and sub-menu for Departments",
          "steps" : [ {
            "id" : 4376,
            "name" : "Validate menu for shop by Department"
          }, {
            "id" : 4377,
            "name" : "Validate Sub-menu for Food (Alimentation)"
          }, {
            "id" : 4378,
            "name" : "Validate Sub-menu for Pets (Animaux)"
          }, {
            "id" : 4379,
            "name" : "Validate Sub-menu for Pets (Animaux) - Part 2"
          }, {
            "id" : 4380,
            "name" : "Validate Sub-menu for Party (Célébrations)"
          }, {
            "id" : 4381,
            "name" : "Validate Sub-menu for Party (Célébrations) - Part 2"
          }, {
            "id" : 4382,
            "name" : "Validate Sub-menu for Kitchen (Cuisine)"
          }, {
            "id" : 4383,
            "name" : "Validate Sub-menu for Kitchen (Cuisine) - Part 2"
          }, {
            "id" : 4384,
            "name" : "Validate Sub-menu for Electronics (Électronique)"
          }, {
            "id" : 4385,
            "name" : "Validate Sub-menu for Electronics (Électronique) - Part 2"
          }, {
            "id" : 4386,
            "name" : "Validate Sub-menu for Office (Fournitures de bureau)"
          }, {
            "id" : 4387,
            "name" : "Validate Sub-menu for Office (Fournitures de bureau) - Part 2"
          }, {
            "id" : 4388,
            "name" : "Validate Sub-menu for Toys (Jouets)"
          }, {
            "id" : 4389,
            "name" : "Validate Sub-menu for Home Decor (Maison)"
          }, {
            "id" : 4390,
            "name" : "Validate Sub-menu for Home Decor (Maison) - Part 2"
          }, {
            "id" : 4391,
            "name" : "Validate Sub-menu for Cleaning (Produits ménagers)"
          }, {
            "id" : 4392,
            "name" : "Validate Sub-menu for Cleaning (Produits ménagers) - Part 2"
          }, {
            "id" : 4393,
            "name" : "Validate Sub-menu for Hardware (Quincaillerie)"
          }, {
            "id" : 4394,
            "name" : "Validate Sub-menu for Cleaning (Quincaillerie) - Part 2"
          }, {
            "id" : 4395,
            "name" : "Validate Sub-menu for Health & Beauty (Santé & beauté)"
          }, {
            "id" : 4396,
            "name" : "Validate Sub-menu for Health & Beauty (Santé & Beauté) - Part 2"
          }, {
            "id" : 4397,
            "name" : "Validate Sub-menu for Clothing (Vêtements)"
          } ]
        }, {
          "id" : 968,
          "name" : "02_Validate All Menu and sub-menu Activity",
          "steps" : [ {
            "id" : 4398,
            "name" : "Validate menu roll down for Activity"
          }, {
            "id" : 4399,
            "name" : "Validate menu for shop by Activity"
          }, {
            "id" : 4400,
            "name" : "Validate Sub-menu Offices (Bureaux)"
          }, {
            "id" : 4401,
            "name" : "Validate Sub-menu Schools (Écoles)"
          }, {
            "id" : 4402,
            "name" : "Validate Sub-menu Maintenance (Entretien général)"
          }, {
            "id" : 4403,
            "name" : "Validate Sub-menu Maintenance (Entretien général) - Part 2"
          }, {
            "id" : 4404,
            "name" : "Validate Sub-menu Event, Party & Wedding Planning (Événements, fêtes et organisation de mariages)"
          }, {
            "id" : 4405,
            "name" : "Validate Sub-menu EPWP (Événements, fêtes et organisation de mariages) - Part 2"
          }, {
            "id" : 4406,
            "name" : "Validate Sub-menu Hospital & Care Facilities (Hôpitaux et établissements de soins)"
          }, {
            "id" : 4407,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels (Traiteurs, restaurants et hôtels)"
          }, {
            "id" : 4408,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels (Traiteurs, restaurants et hôtels) - Part 2"
          } ]
        } ]
      }, {
        "id" : 512,
        "name" : "05_Validate Filter",
        "scenarios" : [ {
          "id" : 969,
          "name" : "01_Validate Filter Department",
          "steps" : [ {
            "id" : 4409,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 4410,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 4411,
            "name" : "03_Validate Filter by Brand (Marque)"
          }, {
            "id" : 4412,
            "name" : "04_Validate Filter by Unit Price (Prix unitaire)"
          }, {
            "id" : 4413,
            "name" : "05_Validate Many Filter Same time"
          } ]
        }, {
          "id" : 970,
          "name" : "02_Validate Filter Activity",
          "steps" : [ {
            "id" : 4414,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 4415,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 4416,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 4417,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 4418,
            "name" : "05_Validate Many Filters Same time"
          } ]
        } ]
      }, {
        "id" : 513,
        "name" : "06_Validate Short",
        "scenarios" : [ {
          "id" : 971,
          "name" : "01_Validate Short Department",
          "steps" : [ {
            "id" : 4419,
            "name" : "01_Validate Price per case Low to High"
          }, {
            "id" : 4420,
            "name" : "02_Validate Price per case High to Low"
          }, {
            "id" : 4421,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 4422,
            "name" : "04_Validatre Name Z to A"
          }, {
            "id" : 4423,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 4424,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        }, {
          "id" : 972,
          "name" : "02_Validate Short Activity",
          "steps" : [ {
            "id" : 4425,
            "name" : "01_Validate price per Case Low to High"
          }, {
            "id" : 4426,
            "name" : "02_Validate price per Case High to Low"
          }, {
            "id" : 4427,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 4428,
            "name" : "04_Validatre Name Z to A"
          }, {
            "id" : 4429,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 4430,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        } ]
      }, {
        "id" : 514,
        "name" : "07_Validate Article Page Content",
        "scenarios" : [ {
          "id" : 973,
          "name" : "01_Validate Department Article Page",
          "steps" : [ {
            "id" : 4431,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 4432,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 4433,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 4434,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 4435,
            "name" : "05_Validate Article title"
          }, {
            "id" : 4436,
            "name" : "06_Validate You may also like"
          } ]
        }, {
          "id" : 974,
          "name" : "02_Validate Activity Article Page",
          "steps" : [ {
            "id" : 4437,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 4438,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 4439,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 4440,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 4441,
            "name" : "05_Validate Article title"
          }, {
            "id" : 4442,
            "name" : "06_Validate You may also like"
          } ]
        } ]
      }, {
        "id" : 515,
        "name" : "08_Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 975,
          "name" : "01_UnMap And Delete Directory",
          "steps" : [ {
            "id" : 4443,
            "name" : "01_Log To UnMap"
          }, {
            "id" : 4444,
            "name" : "02_Un Map and Delete The Directory On Server And Virtual Machine"
          } ]
        }, {
          "id" : 976,
          "name" : "02_Close browser",
          "steps" : [ {
            "id" : 4445,
            "name" : "01_Logging of the Teardown"
          }, {
            "id" : 4446,
            "name" : "02_Close browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 96,
      "name" : "TestYves 2",
      "functionalities" : [ {
        "id" : 581,
        "name" : "01_Setting Of Selenium, Browser And Variables",
        "scenarios" : [ {
          "id" : 1084,
          "name" : "01_Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 4894,
            "name" : "01_Setting Variables (Data Repository)"
          }, {
            "id" : 4895,
            "name" : "02_Log for Data Repository"
          } ]
        }, {
          "id" : 1085,
          "name" : "02_Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 4896,
            "name" : "01_Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 4897,
            "name" : "02_Logging of Setting Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 1086,
          "name" : "03_Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 4898,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub"
          }, {
            "id" : 4899,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub Local"
          }, {
            "id" : 4900,
            "name" : "Open Browser With Type Of Browser And Selenium Hub Amira"
          }, {
            "id" : 6345,
            "name" : "Copy of 01_Open Browser With Type Of Browser And Selenium Hub"
          }, {
            "id" : 4901,
            "name" : "02_Log When Browser is opened"
          } ]
        } ]
      }, {
        "id" : 588,
        "name" : "08_Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 1098,
          "name" : "01_UnMap And Delete Directory",
          "steps" : [ {
            "id" : 4968,
            "name" : "01_Log To UnMap"
          }, {
            "id" : 4969,
            "name" : "02_Un Map and Delete The Directory On Server And Virtual Machine"
          } ]
        }, {
          "id" : 1099,
          "name" : "02_Close browser",
          "steps" : [ {
            "id" : 4970,
            "name" : "01_Logging of the Teardown"
          }, {
            "id" : 4971,
            "name" : "02_Close browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 97,
      "name" : "Copy of 03-DWS (Desktop Shopping and Checkout Safari EN) - SANS SLEEP",
      "functionalities" : [ {
        "id" : 589,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 1100,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 4972,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 4973,
            "name" : "Login Info"
          } ]
        }, {
          "id" : 1101,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 4974,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 4975,
            "name" : "Logging of Setting Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 1102,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 4976,
            "name" : "Open Browser With Type Of Browser And Selenium Hub"
          }, {
            "id" : 4977,
            "name" : "Log Information"
          } ]
        } ]
      }, {
        "id" : 590,
        "name" : "Validate An Anonymous Action",
        "scenarios" : [ {
          "id" : 1103,
          "name" : "Validate Favorite",
          "steps" : [ {
            "id" : 4978,
            "name" : "Validate Favorite Header"
          }, {
            "id" : 4979,
            "name" : "Validate Adding an article to Wish list from Department Page"
          }, {
            "id" : 4980,
            "name" : "Validate Adding an article to Wish list from You may also like on Article Page"
          }, {
            "id" : 4981,
            "name" : "Validate Adding an article to Wish list from Search Results Page"
          }, {
            "id" : 4982,
            "name" : "Validate Adding an article to Wish list from Article Page"
          } ]
        } ]
      }, {
        "id" : 591,
        "name" : "Validate Guest User",
        "scenarios" : [ {
          "id" : 1104,
          "name" : "Validate Guest User Place Order",
          "steps" : [ {
            "id" : 4983,
            "name" : "Validate messages for order placing"
          }, {
            "id" : 4984,
            "name" : "Validate Guest user uses same address for billing and shipping purposes - IN Validate messages for o"
          }, {
            "id" : 4985,
            "name" : "Validate Guest user uses a different address for billing and shipping purposes"
          }, {
            "id" : 4986,
            "name" : "Validate Guest user edits a shipping address"
          }, {
            "id" : 4987,
            "name" : "Validate Guest user edits a billing address"
          }, {
            "id" : 4988,
            "name" : "Validate Guest user adds a new shipping address - IN PREVIOUS CASES"
          }, {
            "id" : 4989,
            "name" : "Validate Guest user adds a new billing address - IN PREVIOUS CASES"
          } ]
        } ]
      }, {
        "id" : 592,
        "name" : "Validate Registered User",
        "scenarios" : [ {
          "id" : 1105,
          "name" : "Validate A Registered Favorite List And Wish List Department",
          "steps" : [ {
            "id" : 4990,
            "name" : "Validate Add Wish List Article"
          }, {
            "id" : 4991,
            "name" : "Validate Share Favorite List"
          }, {
            "id" : 4992,
            "name" : "Validate Delete Wish List Article"
          }, {
            "id" : 4993,
            "name" : "Validate Empty Favorite List"
          }, {
            "id" : 4994,
            "name" : "Validate Account Side Menu Anglais"
          }, {
            "id" : 4995,
            "name" : "Validate Item Out Of Stock"
          }, {
            "id" : 4996,
            "name" : "Validate Wish List"
          }, {
            "id" : 4997,
            "name" : "Validate Minimum Order (150$ - QA) - NOT VALID IN STAGE"
          }, {
            "id" : 4998,
            "name" : "Validate Modify Case Quantity"
          }, {
            "id" : 4999,
            "name" : "Validate Checkout"
          }, {
            "id" : 5000,
            "name" : "Validate Add New Address for Checkout"
          } ]
        } ]
      }, {
        "id" : 593,
        "name" : "Validate AVS Response codes",
        "scenarios" : [ {
          "id" : 1106,
          "name" : "AVS test Declined Cards",
          "steps" : [ {
            "id" : 5001,
            "name" : "Login"
          }, {
            "id" : 5002,
            "name" : "Go to Order Now page and fill in partial card information"
          }, {
            "id" : 5003,
            "name" : "4761739012345611 G International Card Detected"
          }, {
            "id" : 5004,
            "name" : "4761739012345629 I Address Verification Error The billing address was not verified with the card i"
          }, {
            "id" : 5005,
            "name" : "4761739012345645 N Address Verification Error The billing address and postal code do not match"
          }, {
            "id" : 5006,
            "name" : "4761739012345660 R Address Verification Error The billing address was not verified with the card iss"
          }, {
            "id" : 5007,
            "name" : "4761739012345694 C Address Verification Error Please ensure the billing address is correct or contac"
          }, {
            "id" : 5008,
            "name" : "4761739012345652 P Address Verification Error Please ensure the billing address is correct o"
          }, {
            "id" : 5009,
            "name" : "4761739012345728 Z Address Verification Error Please ensure the billing address is correct o"
          }, {
            "id" : 5010,
            "name" : "4761739012345678 A Address Verification Error Please ensure the billing postal code is correct or co"
          }, {
            "id" : 5011,
            "name" : "4761739012345686 B Address Verification Error Please ensure the billing postal code is corre"
          }, {
            "id" : 5012,
            "name" : "4761739012345751 S Address Verification Error Billing address verification is required"
          }, {
            "id" : 5013,
            "name" : "4761739012345744 U Address Verification Error Billing address verification is required"
          } ]
        } ]
      }, {
        "id" : 594,
        "name" : "Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 1107,
          "name" : "Close Browser UnMap And Delete Directories",
          "steps" : [ {
            "id" : 5014,
            "name" : "Login information"
          }, {
            "id" : 5015,
            "name" : "Un Map and Delete The Directory"
          }, {
            "id" : 5016,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 98,
      "name" : "Copie de 02-DWS (Desktop My Account Safari EN)",
      "functionalities" : [ {
        "id" : 595,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 1108,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 5017,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 5018,
            "name" : "Log Setting Variables (Data Repository)"
          } ]
        }, {
          "id" : 1109,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 5019,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 5020,
            "name" : "Log Of Setting Selenium Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 1110,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 5021,
            "name" : "Setting The Opening Of Browser With Selenium Hub"
          } ]
        } ]
      }, {
        "id" : 596,
        "name" : "Set Language English",
        "scenarios" : [ {
          "id" : 1111,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 5022,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 597,
        "name" : "Validate My Account",
        "scenarios" : [ {
          "id" : 1112,
          "name" : "Validate Login Functions",
          "steps" : [ {
            "id" : 5023,
            "name" : "Validate Login Logout"
          }, {
            "id" : 5024,
            "name" : "Validate Login Forgot Password"
          } ]
        }, {
          "id" : 1113,
          "name" : "Validate User",
          "steps" : [ {
            "id" : 5025,
            "name" : "Validate User Creation"
          }, {
            "id" : 5026,
            "name" : "Validate User Address Creation"
          } ]
        }, {
          "id" : 1114,
          "name" : "Validate Page Account",
          "steps" : [ {
            "id" : 5027,
            "name" : "Validate Create Blank Account"
          }, {
            "id" : 5028,
            "name" : "Validate Create Account With Invalid Data"
          }, {
            "id" : 5029,
            "name" : "Validate User Register Account Invalid Password"
          }, {
            "id" : 5030,
            "name" : "Validate User Register Account Different Password"
          }, {
            "id" : 5031,
            "name" : "Validate Logged User Shopping Cart Remember"
          }, {
            "id" : 5032,
            "name" : "Validate Modify Account And information French"
          }, {
            "id" : 5033,
            "name" : "Validate Modify Account And information English"
          }, {
            "id" : 5034,
            "name" : "Validate information into Login page"
          }, {
            "id" : 5035,
            "name" : "Validate Stay in checkbox"
          }, {
            "id" : 5036,
            "name" : "Validate Forgot password xxx(Inclu dans Validate Login Functions) xxx"
          } ]
        } ]
      }, {
        "id" : 598,
        "name" : "Close Browser",
        "scenarios" : [ {
          "id" : 1115,
          "name" : "Close Browser",
          "steps" : [ {
            "id" : 5037,
            "name" : "Log Of Closing Browser"
          }, {
            "id" : 5038,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 6,
      "name" : "01_DWS (Desktop Product Catalog Chrome EN)",
      "functionalities" : [ {
        "id" : 165,
        "name" : "01_Setting Of Selenium, Browser And Variables",
        "scenarios" : [ {
          "id" : 311,
          "name" : "01_Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 1414,
            "name" : "01_Setting Variables (Data Repository)"
          }, {
            "id" : 1653,
            "name" : "02_Log for Data Repository"
          } ]
        }, {
          "id" : 306,
          "name" : "02_Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 1403,
            "name" : "01_Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 1409,
            "name" : "02_Logging of Setting Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 307,
          "name" : "03_Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 1404,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub"
          }, {
            "id" : 4537,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub Local"
          }, {
            "id" : 4801,
            "name" : "Open Browser With Type Of Browser And Selenium Hub Amira"
          }, {
            "id" : 1654,
            "name" : "02_Log When Browser is opened"
          } ]
        } ]
      }, {
        "id" : 191,
        "name" : "02_Set Language English",
        "scenarios" : [ {
          "id" : 365,
          "name" : "01_Set Language English",
          "steps" : [ {
            "id" : 1643,
            "name" : "01_Set Language English"
          } ]
        } ]
      }, {
        "id" : 32,
        "name" : "03_Validate Content validation and Browse articles from home page",
        "scenarios" : [ {
          "id" : 58,
          "name" : "01_Validate Home Page",
          "steps" : [ {
            "id" : 61,
            "name" : "01_Validate Sticky header"
          }, {
            "id" : 62,
            "name" : "02_Validate Start shopping Button on Banner and the Shop now"
          } ]
        }, {
          "id" : 220,
          "name" : "02_Validate Header",
          "steps" : [ {
            "id" : 853,
            "name" : "01_Validate Top Middle - Header"
          }, {
            "id" : 854,
            "name" : "02_Validate Low - Header"
          } ]
        } ]
      }, {
        "id" : 35,
        "name" : "04_Validate Shop By Activity and Department - menu & sub-menu items",
        "scenarios" : [ {
          "id" : 59,
          "name" : "01_Validate All menu and sub-menu for Departments",
          "steps" : [ {
            "id" : 3095,
            "name" : "Validate Sub-menu for Cleaning"
          }, {
            "id" : 1645,
            "name" : "Validate Sub-menu for Clothing"
          }, {
            "id" : 75,
            "name" : "Validate Sub-menu for Electronics"
          }, {
            "id" : 76,
            "name" : "Validate Sub-menu for Food"
          }, {
            "id" : 77,
            "name" : "Validate Sub-menu for Hardware"
          }, {
            "id" : 78,
            "name" : "Validate Sub-menu for Health & Beauty"
          }, {
            "id" : 79,
            "name" : "Validate Sub-menu for Home Decor"
          }, {
            "id" : 80,
            "name" : "Validate Sub-menu for Kitchen"
          }, {
            "id" : 2158,
            "name" : "Validate Sub-menu for Kitchen (part 2 - Kitchen_Basics)"
          }, {
            "id" : 1177,
            "name" : "Validate Sub-menu for Office"
          }, {
            "id" : 141,
            "name" : "Validate Sub-menu for Party"
          }, {
            "id" : 142,
            "name" : "Validate Sub-menu for Pets"
          }, {
            "id" : 147,
            "name" : "Validate Sub-menu for Toys"
          } ]
        }, {
          "id" : 63,
          "name" : "02_Validate All Menu and sub-menu Activity",
          "steps" : [ {
            "id" : 85,
            "name" : "Validate menu roll down for Activity"
          }, {
            "id" : 137,
            "name" : "Validate menu for shop by Activity"
          }, {
            "id" : 86,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels"
          }, {
            "id" : 2159,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels (part 2)"
          }, {
            "id" : 148,
            "name" : "Validate Sub-menu Event, Party & Wedding Planning"
          }, {
            "id" : 2182,
            "name" : "Validate Sub-menu Event, Party & Wedding Planning (part 2)"
          }, {
            "id" : 149,
            "name" : "Validate Sub-menu Hospital & Care Facilities"
          }, {
            "id" : 2184,
            "name" : "Validate Sub-menu Hospital & Care Facilities (part 2)"
          }, {
            "id" : 150,
            "name" : "Validate Sub-menu Maintenance"
          }, {
            "id" : 2188,
            "name" : "Validate Sub-menu Maintenance (part 2)"
          }, {
            "id" : 151,
            "name" : "Validate Sub-menu Offices"
          }, {
            "id" : 2189,
            "name" : "Validate Sub-menu Offices (part 2)"
          }, {
            "id" : 152,
            "name" : "Validate Sub-menu Schools"
          }, {
            "id" : 2190,
            "name" : "Validate Sub-menu Schools (part 2)"
          } ]
        } ]
      }, {
        "id" : 36,
        "name" : "05_Validate Filter",
        "scenarios" : [ {
          "id" : 64,
          "name" : "01_Validate Filter Department",
          "steps" : [ {
            "id" : 92,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 94,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 95,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 97,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 98,
            "name" : "05_Validate Many Filter Same time"
          } ]
        }, {
          "id" : 221,
          "name" : "02_Validate Filter Activity",
          "steps" : [ {
            "id" : 855,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 856,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 857,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 858,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 859,
            "name" : "05_Validate Many Filters Same time"
          } ]
        } ]
      }, {
        "id" : 37,
        "name" : "06_Validate Short",
        "scenarios" : [ {
          "id" : 66,
          "name" : "01_Validate Short Department",
          "steps" : [ {
            "id" : 106,
            "name" : "01_Validate Price per case Low to High"
          }, {
            "id" : 107,
            "name" : "02_Validate Price per case High to Low"
          }, {
            "id" : 108,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 109,
            "name" : "04_Validatre Name Z to A"
          }, {
            "id" : 110,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 111,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        }, {
          "id" : 223,
          "name" : "02_Validate Short Activity",
          "steps" : [ {
            "id" : 866,
            "name" : "01_Validate price per Case Low to High"
          }, {
            "id" : 867,
            "name" : "02_Validate price per Case High to Low"
          }, {
            "id" : 868,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 869,
            "name" : "04_Validatre Name Z to A"
          }, {
            "id" : 870,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 871,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        } ]
      }, {
        "id" : 38,
        "name" : "07_Validate Article Page Content",
        "scenarios" : [ {
          "id" : 68,
          "name" : "01_Validate Department Article Page",
          "steps" : [ {
            "id" : 118,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 119,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 121,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 122,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 124,
            "name" : "05_Validate Article title"
          }, {
            "id" : 125,
            "name" : "06_Validate You may also like"
          } ]
        }, {
          "id" : 224,
          "name" : "02_Validate Activity Article Page",
          "steps" : [ {
            "id" : 872,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 873,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 874,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 875,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 876,
            "name" : "05_Validate Article title"
          }, {
            "id" : 877,
            "name" : "06_Validate You may also like"
          } ]
        } ]
      }, {
        "id" : 166,
        "name" : "08_Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 313,
          "name" : "01_UnMap And Delete Directory",
          "steps" : [ {
            "id" : 1419,
            "name" : "01_Log To UnMap"
          }, {
            "id" : 1418,
            "name" : "02_Un Map and Delete The Directory On Server And Virtual Machine"
          } ]
        }, {
          "id" : 308,
          "name" : "02_Close browser",
          "steps" : [ {
            "id" : 1410,
            "name" : "01_Logging of the Teardown"
          }, {
            "id" : 1405,
            "name" : "02_Close browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 99,
      "name" : "Copy Pour DIDIER 01_DWS (Desktop Product Catalog Safari EN)",
      "functionalities" : [ {
        "id" : 603,
        "name" : "01_Setting Of Selenium, Browser And Variables",
        "scenarios" : [ {
          "id" : 1120,
          "name" : "01_Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 5047,
            "name" : "01_Setting Variables (Data Repository)"
          }, {
            "id" : 5048,
            "name" : "02_Log for Data Repository"
          } ]
        }, {
          "id" : 1121,
          "name" : "02_Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 5049,
            "name" : "01_Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 5050,
            "name" : "02_Logging of Setting Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 1122,
          "name" : "03_Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 5051,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub"
          }, {
            "id" : 5052,
            "name" : "02_Log When Browser is opened"
          } ]
        } ]
      }, {
        "id" : 604,
        "name" : "02_Set Language English",
        "scenarios" : [ {
          "id" : 1123,
          "name" : "01_Set Language English",
          "steps" : [ {
            "id" : 5053,
            "name" : "01_Set Language English"
          } ]
        } ]
      }, {
        "id" : 605,
        "name" : "03_Validate Content validation and Browse articles from home page",
        "scenarios" : [ {
          "id" : 1124,
          "name" : "01_Validate Home Page",
          "steps" : [ {
            "id" : 5054,
            "name" : "01_Validate Sticky header"
          }, {
            "id" : 5055,
            "name" : "02_Validate Start shopping Button on Banner and the Shop now"
          } ]
        }, {
          "id" : 1125,
          "name" : "02_Validate Header",
          "steps" : [ {
            "id" : 5056,
            "name" : "01_Validate Top Middle - Header"
          }, {
            "id" : 5057,
            "name" : "02_Validate Low - Header"
          } ]
        } ]
      }, {
        "id" : 606,
        "name" : "04_Validate Shop By Activity and Department - menu & sub-menu items",
        "scenarios" : [ {
          "id" : 1126,
          "name" : "01_Validate All menu and sub-menu for Departments",
          "steps" : [ {
            "id" : 5058,
            "name" : "Validate Sub-menu for Cleaning"
          }, {
            "id" : 5059,
            "name" : "Validate Sub-menu for Clothing"
          }, {
            "id" : 5060,
            "name" : "Validate Sub-menu for Electronics"
          }, {
            "id" : 5061,
            "name" : "Validate Sub-menu for Food"
          }, {
            "id" : 5062,
            "name" : "Validate Sub-menu for Hardware"
          }, {
            "id" : 5063,
            "name" : "Validate Sub-menu for Health & Beauty"
          }, {
            "id" : 5064,
            "name" : "Validate Sub-menu for Home Decor"
          }, {
            "id" : 5065,
            "name" : "Validate Sub-menu for Kitchen"
          }, {
            "id" : 5066,
            "name" : "Validate Sub-menu for Kitchen (part 2 - Kitchen_Basics)"
          }, {
            "id" : 5067,
            "name" : "Validate Sub-menu for Office"
          }, {
            "id" : 5068,
            "name" : "Validate Sub-menu for Party"
          }, {
            "id" : 5069,
            "name" : "Validate Sub-menu for Pets"
          }, {
            "id" : 5070,
            "name" : "Validate Sub-menu for Toys"
          } ]
        }, {
          "id" : 1127,
          "name" : "02_Validate All Menu and sub-menu Activity",
          "steps" : [ {
            "id" : 5071,
            "name" : "Validate menu roll down for Activity"
          }, {
            "id" : 5072,
            "name" : "Validate menu for shop by Activity"
          }, {
            "id" : 5073,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels"
          }, {
            "id" : 5074,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels (part 2)"
          }, {
            "id" : 5075,
            "name" : "Validate Sub-menu Event, Party & Wedding Planning"
          }, {
            "id" : 5076,
            "name" : "Validate Sub-menu Event, Party & Wedding Planning (part 2)"
          }, {
            "id" : 5077,
            "name" : "Validate Sub-menu Hospital & Care Facilities"
          }, {
            "id" : 5078,
            "name" : "Validate Sub-menu Hospital & Care Facilities (part 2)"
          }, {
            "id" : 5079,
            "name" : "Validate Sub-menu Maintenance"
          }, {
            "id" : 5080,
            "name" : "Validate Sub-menu Maintenance (part 2)"
          }, {
            "id" : 5081,
            "name" : "Validate Sub-menu Offices"
          }, {
            "id" : 5082,
            "name" : "Validate Sub-menu Offices (part 2)"
          }, {
            "id" : 5083,
            "name" : "Validate Sub-menu Schools"
          }, {
            "id" : 5084,
            "name" : "Validate Sub-menu Schools (part 2)"
          } ]
        } ]
      }, {
        "id" : 607,
        "name" : "05_Validate Filter",
        "scenarios" : [ {
          "id" : 1128,
          "name" : "01_Validate Filter Department",
          "steps" : [ {
            "id" : 5085,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 5086,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 5087,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 5088,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 5089,
            "name" : "05_Validate Many Filter Same time"
          } ]
        }, {
          "id" : 1129,
          "name" : "02_Validate Filter Activity",
          "steps" : [ {
            "id" : 5090,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 5091,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 5092,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 5093,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 5094,
            "name" : "05_Validate Many Filters Same time"
          } ]
        } ]
      }, {
        "id" : 608,
        "name" : "06_Validate Short",
        "scenarios" : [ {
          "id" : 1130,
          "name" : "01_Validate Short Department",
          "steps" : [ {
            "id" : 5095,
            "name" : "01_Validate Price per case Low to High"
          }, {
            "id" : 5096,
            "name" : "02_Validate Price per case High to Low"
          }, {
            "id" : 5097,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 5098,
            "name" : "04_Validatre Name Z to A"
          }, {
            "id" : 5099,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 5100,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        }, {
          "id" : 1131,
          "name" : "02_Validate Short Activity",
          "steps" : [ {
            "id" : 5101,
            "name" : "01_Validate price per Case Low to High"
          }, {
            "id" : 5102,
            "name" : "02_Validate price per Case High to Low"
          }, {
            "id" : 5103,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 5104,
            "name" : "04_Validatre Name Z to A"
          }, {
            "id" : 5105,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 5106,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        } ]
      }, {
        "id" : 609,
        "name" : "07_Validate Article Page Content",
        "scenarios" : [ {
          "id" : 1132,
          "name" : "01_Validate Department Article Page",
          "steps" : [ {
            "id" : 5107,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 5108,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 5109,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 5110,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 5111,
            "name" : "05_Validate Article title"
          }, {
            "id" : 5112,
            "name" : "06_Validate You may also like"
          } ]
        }, {
          "id" : 1133,
          "name" : "02_Validate Activity Article Page",
          "steps" : [ {
            "id" : 5113,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 5114,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 5115,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 5116,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 5117,
            "name" : "05_Validate Article title"
          }, {
            "id" : 5118,
            "name" : "06_Validate You may also like"
          } ]
        } ]
      }, {
        "id" : 610,
        "name" : "08_Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 1134,
          "name" : "01_UnMap And Delete Directory",
          "steps" : [ {
            "id" : 5119,
            "name" : "01_Log To UnMap"
          }, {
            "id" : 5120,
            "name" : "02_Un Map and Delete The Directory On Server And Virtual Machine"
          } ]
        }, {
          "id" : 1135,
          "name" : "02_Close browser",
          "steps" : [ {
            "id" : 5121,
            "name" : "01_Logging of the Teardown"
          }, {
            "id" : 5122,
            "name" : "02_Close browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 106,
      "name" : "Copy Pour AMIRA 01_DWS (Desktop Product Catalog Safari EN)",
      "functionalities" : [ {
        "id" : 649,
        "name" : "01_Setting Of Selenium, Browser And Variables",
        "scenarios" : [ {
          "id" : 1194,
          "name" : "01_Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 5410,
            "name" : "01_Setting Variables (Data Repository)"
          }, {
            "id" : 5411,
            "name" : "02_Log for Data Repository"
          } ]
        }, {
          "id" : 1195,
          "name" : "02_Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 5412,
            "name" : "01_Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 5413,
            "name" : "02_Logging of Setting Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 1196,
          "name" : "03_Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 5414,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub"
          }, {
            "id" : 5415,
            "name" : "02_Log When Browser is opened"
          } ]
        } ]
      }, {
        "id" : 650,
        "name" : "02_Set Language English",
        "scenarios" : [ {
          "id" : 1197,
          "name" : "01_Set Language English",
          "steps" : [ {
            "id" : 5416,
            "name" : "01_Set Language English"
          } ]
        } ]
      }, {
        "id" : 651,
        "name" : "03_Validate Content validation and Browse articles from home page",
        "scenarios" : [ {
          "id" : 1198,
          "name" : "01_Validate Home Page",
          "steps" : [ {
            "id" : 5417,
            "name" : "01_Validate Sticky header"
          }, {
            "id" : 5418,
            "name" : "02_Validate Start shopping Button on Banner and the Shop now"
          } ]
        }, {
          "id" : 1199,
          "name" : "02_Validate Header",
          "steps" : [ {
            "id" : 5419,
            "name" : "01_Validate Top Middle - Header"
          }, {
            "id" : 5420,
            "name" : "02_Validate Low - Header"
          } ]
        } ]
      }, {
        "id" : 652,
        "name" : "04_Validate Shop By Activity and Department - menu & sub-menu items",
        "scenarios" : [ {
          "id" : 1200,
          "name" : "01_Validate All menu and sub-menu for Departments",
          "steps" : [ {
            "id" : 5421,
            "name" : "Validate Sub-menu for Cleaning"
          }, {
            "id" : 5422,
            "name" : "Validate Sub-menu for Clothing"
          }, {
            "id" : 5423,
            "name" : "Validate Sub-menu for Electronics"
          }, {
            "id" : 5424,
            "name" : "Validate Sub-menu for Food"
          }, {
            "id" : 5425,
            "name" : "Validate Sub-menu for Hardware"
          }, {
            "id" : 5426,
            "name" : "Validate Sub-menu for Health & Beauty"
          }, {
            "id" : 5427,
            "name" : "Validate Sub-menu for Home Decor"
          }, {
            "id" : 5428,
            "name" : "Validate Sub-menu for Kitchen"
          }, {
            "id" : 5429,
            "name" : "Validate Sub-menu for Kitchen (part 2 - Kitchen_Basics)"
          }, {
            "id" : 5430,
            "name" : "Validate Sub-menu for Office"
          }, {
            "id" : 5431,
            "name" : "Validate Sub-menu for Party"
          }, {
            "id" : 5432,
            "name" : "Validate Sub-menu for Pets"
          }, {
            "id" : 5433,
            "name" : "Validate Sub-menu for Toys"
          } ]
        }, {
          "id" : 1201,
          "name" : "02_Validate All Menu and sub-menu Activity",
          "steps" : [ {
            "id" : 5434,
            "name" : "Validate menu roll down for Activity"
          }, {
            "id" : 5435,
            "name" : "Validate menu for shop by Activity"
          }, {
            "id" : 5436,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels"
          }, {
            "id" : 5437,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels (part 2)"
          }, {
            "id" : 5438,
            "name" : "Validate Sub-menu Event, Party & Wedding Planning"
          }, {
            "id" : 5439,
            "name" : "Validate Sub-menu Event, Party & Wedding Planning (part 2)"
          }, {
            "id" : 5440,
            "name" : "Validate Sub-menu Hospital & Care Facilities"
          }, {
            "id" : 5441,
            "name" : "Validate Sub-menu Hospital & Care Facilities (part 2)"
          }, {
            "id" : 5442,
            "name" : "Validate Sub-menu Maintenance"
          }, {
            "id" : 5443,
            "name" : "Validate Sub-menu Maintenance (part 2)"
          }, {
            "id" : 5444,
            "name" : "Validate Sub-menu Offices"
          }, {
            "id" : 5445,
            "name" : "Validate Sub-menu Offices (part 2)"
          }, {
            "id" : 5446,
            "name" : "Validate Sub-menu Schools"
          }, {
            "id" : 5447,
            "name" : "Validate Sub-menu Schools (part 2)"
          } ]
        } ]
      }, {
        "id" : 653,
        "name" : "05_Validate Filter",
        "scenarios" : [ {
          "id" : 1202,
          "name" : "01_Validate Filter Department",
          "steps" : [ {
            "id" : 5448,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 5449,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 5450,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 5451,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 5452,
            "name" : "05_Validate Many Filter Same time"
          } ]
        }, {
          "id" : 1203,
          "name" : "02_Validate Filter Activity",
          "steps" : [ {
            "id" : 5453,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 5454,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 5455,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 5456,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 5457,
            "name" : "05_Validate Many Filters Same time"
          } ]
        } ]
      }, {
        "id" : 654,
        "name" : "06_Validate Short",
        "scenarios" : [ {
          "id" : 1204,
          "name" : "01_Validate Short Department",
          "steps" : [ {
            "id" : 5458,
            "name" : "01_Validate Price per case Low to High"
          }, {
            "id" : 5459,
            "name" : "02_Validate Price per case High to Low"
          }, {
            "id" : 5460,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 5461,
            "name" : "04_Validatre Name Z to A"
          }, {
            "id" : 5462,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 5463,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        }, {
          "id" : 1205,
          "name" : "02_Validate Short Activity",
          "steps" : [ {
            "id" : 5464,
            "name" : "01_Validate price per Case Low to High"
          }, {
            "id" : 5465,
            "name" : "02_Validate price per Case High to Low"
          }, {
            "id" : 5466,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 5467,
            "name" : "04_Validatre Name Z to A"
          }, {
            "id" : 5468,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 5469,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        } ]
      }, {
        "id" : 655,
        "name" : "07_Validate Article Page Content",
        "scenarios" : [ {
          "id" : 1206,
          "name" : "01_Validate Department Article Page",
          "steps" : [ {
            "id" : 5470,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 5471,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 5472,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 5473,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 5474,
            "name" : "05_Validate Article title"
          }, {
            "id" : 5475,
            "name" : "06_Validate You may also like"
          } ]
        }, {
          "id" : 1207,
          "name" : "02_Validate Activity Article Page",
          "steps" : [ {
            "id" : 5476,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 5477,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 5478,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 5479,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 5480,
            "name" : "05_Validate Article title"
          }, {
            "id" : 5481,
            "name" : "06_Validate You may also like"
          } ]
        } ]
      }, {
        "id" : 656,
        "name" : "08_Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 1208,
          "name" : "01_UnMap And Delete Directory",
          "steps" : [ {
            "id" : 5482,
            "name" : "01_Log To UnMap"
          }, {
            "id" : 5483,
            "name" : "02_Un Map and Delete The Directory On Server And Virtual Machine"
          } ]
        }, {
          "id" : 1209,
          "name" : "02_Close browser",
          "steps" : [ {
            "id" : 5484,
            "name" : "01_Logging of the Teardown"
          }, {
            "id" : 5485,
            "name" : "02_Close browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 108,
      "name" : "Test Yves 01-Mobile Tablette (Android Product Catalog Chrome EN)",
      "functionalities" : [ {
        "id" : 661,
        "name" : "01_Setting Of Selenium, Browser And Variables",
        "scenarios" : [ {
          "id" : 1218,
          "name" : "01_Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 5508,
            "name" : "01_Setting Variables (Data Repository)"
          }, {
            "id" : 5509,
            "name" : "02_Log for Data Repository"
          } ]
        }, {
          "id" : 1219,
          "name" : "03_Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 5510,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub Physique"
          }, {
            "id" : 5511,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub Simulator"
          }, {
            "id" : 5512,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub Simulator MacDev1"
          }, {
            "id" : 5513,
            "name" : "02_Log When Browser is opened"
          } ]
        } ]
      }, {
        "id" : 662,
        "name" : "02_Set Language English",
        "scenarios" : [ {
          "id" : 1220,
          "name" : "01_Set Language English",
          "steps" : [ {
            "id" : 5514,
            "name" : "01_Set Language English"
          } ]
        } ]
      }, {
        "id" : 663,
        "name" : "03_Validate Content validation and Browse articles from home page",
        "scenarios" : [ {
          "id" : 1221,
          "name" : "01_Validate Home Page",
          "steps" : [ {
            "id" : 5515,
            "name" : "01_Validate Sticky header"
          }, {
            "id" : 5516,
            "name" : "02_Validate Start shopping Button on Banner and the Shop now"
          } ]
        }, {
          "id" : 1222,
          "name" : "02_Validate Header",
          "steps" : [ {
            "id" : 5517,
            "name" : "01_Validate Top Middle - Header"
          }, {
            "id" : 5518,
            "name" : "02_Validate Low - Header"
          } ]
        } ]
      }, {
        "id" : 664,
        "name" : "04_Validate Shop By Activity and Department - menu & sub-menu items",
        "scenarios" : [ {
          "id" : 1223,
          "name" : "01_Validate All menu and sub-menu for Departments",
          "steps" : [ {
            "id" : 5519,
            "name" : "Validate Sub-menu for Cleaning"
          }, {
            "id" : 5520,
            "name" : "Validate Sub-menu for Clothing"
          }, {
            "id" : 5521,
            "name" : "Validate Sub-menu for Electronics"
          }, {
            "id" : 5522,
            "name" : "Validate Sub-menu for Food"
          }, {
            "id" : 5523,
            "name" : "Validate Sub-menu for Hardware"
          }, {
            "id" : 5524,
            "name" : "Validate Sub-menu for Health & Beauty"
          }, {
            "id" : 5525,
            "name" : "Validate Sub-menu for Home Decor"
          }, {
            "id" : 5526,
            "name" : "Validate Sub-menu for Kitchen"
          }, {
            "id" : 5527,
            "name" : "Validate Sub-menu for Office"
          }, {
            "id" : 5528,
            "name" : "Validate Sub-menu for Party"
          }, {
            "id" : 5529,
            "name" : "Validate Sub-menu for Pets"
          }, {
            "id" : 5530,
            "name" : "Validate Sub-menu for Toys"
          } ]
        }, {
          "id" : 1224,
          "name" : "02_Validate All Menu and sub-menu Activity",
          "steps" : [ {
            "id" : 5531,
            "name" : "Validate menu roll down for Activity"
          }, {
            "id" : 5532,
            "name" : "Validate menu for shop by Activity"
          }, {
            "id" : 5533,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels"
          }, {
            "id" : 5534,
            "name" : "Validate Sub-menu Event, Party & Wedding Planning"
          }, {
            "id" : 5535,
            "name" : "Validate Sub-menu Hospital & Care Facilities"
          }, {
            "id" : 5536,
            "name" : "Validate Sub-menu Maintenance"
          }, {
            "id" : 5537,
            "name" : "Validate Sub-menu Offices"
          }, {
            "id" : 5538,
            "name" : "Validate Sub-menu Schools"
          } ]
        } ]
      }, {
        "id" : 665,
        "name" : "05_Validate Filter",
        "scenarios" : [ {
          "id" : 1225,
          "name" : "01_Validate Filter Department",
          "steps" : [ {
            "id" : 5539,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 5540,
            "name" : "02_Validate Filter By Departments"
          }, {
            "id" : 5541,
            "name" : "03_Validate Filter by Business"
          }, {
            "id" : 5542,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 5543,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 5544,
            "name" : "05_Validate Many Filter Same time"
          } ]
        }, {
          "id" : 1226,
          "name" : "02_Validate Filter Activity",
          "steps" : [ {
            "id" : 5545,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 5546,
            "name" : "02_Validate Filter By Departments"
          }, {
            "id" : 5547,
            "name" : "03_Validate Filter by Business"
          }, {
            "id" : 5548,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 5549,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 5550,
            "name" : "05_Validate Many Filter Same time"
          } ]
        }, {
          "id" : 1227,
          "name" : "02_Validate Filter ActivityOLD",
          "steps" : [ {
            "id" : 5551,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 5552,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 5553,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 5554,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 5555,
            "name" : "05_Validate Many Filters Same time"
          } ]
        } ]
      }, {
        "id" : 666,
        "name" : "06_Validate Short",
        "scenarios" : [ {
          "id" : 1228,
          "name" : "01_Validate Short Department",
          "steps" : [ {
            "id" : 5556,
            "name" : "01_Validate Price per case Low to High"
          }, {
            "id" : 5557,
            "name" : "02_Validate Price per case High to Low"
          }, {
            "id" : 5558,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 5559,
            "name" : "04_Validate Name Z to A"
          }, {
            "id" : 5560,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 5561,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        }, {
          "id" : 1229,
          "name" : "02_Validate Short Activity",
          "steps" : [ {
            "id" : 5562,
            "name" : "01_Validate price per Case Low to High"
          }, {
            "id" : 5563,
            "name" : "02_Validate price per Case High to Low"
          }, {
            "id" : 5564,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 5565,
            "name" : "04_Validatre Name Z to A"
          }, {
            "id" : 5566,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 5567,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        } ]
      }, {
        "id" : 667,
        "name" : "07_Validate Article Page Content",
        "scenarios" : [ {
          "id" : 1230,
          "name" : "01_Validate Department Article Page",
          "steps" : [ {
            "id" : 5568,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 5569,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 5570,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 5571,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 5572,
            "name" : "05_Validate Article title"
          }, {
            "id" : 5573,
            "name" : "06_Validate You may also like"
          }, {
            "id" : 5574,
            "name" : "Copy of 03_Validate Add Favorite in article page"
          } ]
        }, {
          "id" : 1231,
          "name" : "02_Validate Activity Article Page",
          "steps" : [ {
            "id" : 5575,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 5576,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 5577,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 5578,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 5579,
            "name" : "05_Validate Article title"
          }, {
            "id" : 5580,
            "name" : "06_Validate You may also like"
          } ]
        } ]
      }, {
        "id" : 668,
        "name" : "08_Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 1232,
          "name" : "01_UnMap And Delete Directory",
          "steps" : [ {
            "id" : 5581,
            "name" : "01_Log To UnMap"
          }, {
            "id" : 5582,
            "name" : "02_Un Map and Delete The Directory On Server And Virtual Machine"
          } ]
        }, {
          "id" : 1233,
          "name" : "02_Close browser",
          "steps" : [ {
            "id" : 5583,
            "name" : "01_Logging of the Teardown"
          }, {
            "id" : 5584,
            "name" : "02_Close Application Mobile"
          } ]
        } ]
      } ]
    }, {
      "id" : 53,
      "name" : "01_DWS (Desktop Product Catalog IE EN)",
      "functionalities" : [ {
        "id" : 299,
        "name" : "01_Setting Of Selenium, Browser And Variables",
        "scenarios" : [ {
          "id" : 573,
          "name" : "01_Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 2484,
            "name" : "01_Setting Variables (Data Repository)"
          }, {
            "id" : 2485,
            "name" : "02_Log for Data Repository"
          } ]
        }, {
          "id" : 574,
          "name" : "02_Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 2486,
            "name" : "01_Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 2487,
            "name" : "02_Logging of Setting Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 575,
          "name" : "03_Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 2488,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub"
          }, {
            "id" : 4778,
            "name" : "Open Browser With Type Of Browser And Selenium Hub AMIRA"
          }, {
            "id" : 2489,
            "name" : "02_Log When Browser is opened"
          } ]
        } ]
      }, {
        "id" : 300,
        "name" : "02_Set Language English",
        "scenarios" : [ {
          "id" : 576,
          "name" : "01_Set Language English",
          "steps" : [ {
            "id" : 2490,
            "name" : "01_Set Language English"
          } ]
        } ]
      }, {
        "id" : 301,
        "name" : "03_Validate Content validation and Browse articles from home page",
        "scenarios" : [ {
          "id" : 577,
          "name" : "01_Validate Home Page",
          "steps" : [ {
            "id" : 2491,
            "name" : "01_Validate Sticky header"
          }, {
            "id" : 2492,
            "name" : "02_Validate Start shopping Button on Banner and the Shop now"
          } ]
        }, {
          "id" : 578,
          "name" : "02_Validate Header",
          "steps" : [ {
            "id" : 2493,
            "name" : "01_Validate Top Middle - Header"
          }, {
            "id" : 2494,
            "name" : "02_Validate Low - Header"
          } ]
        } ]
      }, {
        "id" : 302,
        "name" : "04_Validate Shop By Activity and Department - menu & sub-menu items",
        "scenarios" : [ {
          "id" : 579,
          "name" : "01_Validate All menu and sub-menu for Departments",
          "steps" : [ {
            "id" : 2496,
            "name" : "Validate Sub-menu for Cleaning"
          }, {
            "id" : 2497,
            "name" : "Validate Sub-menu for Clothing"
          }, {
            "id" : 2498,
            "name" : "Validate Sub-menu for Electronics"
          }, {
            "id" : 2499,
            "name" : "Validate Sub-menu for Food"
          }, {
            "id" : 2500,
            "name" : "Validate Sub-menu for Hardware"
          }, {
            "id" : 2501,
            "name" : "Validate Sub-menu for Health & Beauty"
          }, {
            "id" : 2502,
            "name" : "Validate Sub-menu for Home Decor"
          }, {
            "id" : 2503,
            "name" : "Validate Sub-menu for Kitchen"
          }, {
            "id" : 2504,
            "name" : "Validate Sub-menu for Kitchen (part 2 - Kitchen_Basics)"
          }, {
            "id" : 2505,
            "name" : "Validate Sub-menu for Office"
          }, {
            "id" : 2506,
            "name" : "Validate Sub-menu for Party"
          }, {
            "id" : 2507,
            "name" : "Validate Sub-menu for Pets"
          }, {
            "id" : 2508,
            "name" : "Validate Sub-menu for Toys"
          } ]
        }, {
          "id" : 580,
          "name" : "02_Validate All Menu and sub-menu Activity",
          "steps" : [ {
            "id" : 2511,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels"
          }, {
            "id" : 2512,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels (part 2)"
          }, {
            "id" : 2513,
            "name" : "Validate Sub-menu Event, Party & Wedding Planning"
          }, {
            "id" : 2514,
            "name" : "Validate Sub-menu Event, Party & Wedding Planning (part 2)"
          }, {
            "id" : 2515,
            "name" : "Validate Sub-menu Hospital & Care Facilities"
          }, {
            "id" : 2516,
            "name" : "Validate Sub-menu Hospital & Care Facilities (part 2)"
          }, {
            "id" : 2517,
            "name" : "Validate Sub-menu Maintenance"
          }, {
            "id" : 2518,
            "name" : "Validate Sub-menu Maintenance (part 2)"
          }, {
            "id" : 2519,
            "name" : "Validate Sub-menu Offices"
          }, {
            "id" : 2520,
            "name" : "Validate Sub-menu Offices (part 2)"
          }, {
            "id" : 2521,
            "name" : "Validate Sub-menu Schools"
          }, {
            "id" : 2522,
            "name" : "Validate Sub-menu Schools (part 2)"
          } ]
        } ]
      }, {
        "id" : 303,
        "name" : "05_Validate Filter",
        "scenarios" : [ {
          "id" : 581,
          "name" : "01_Validate Filter Department",
          "steps" : [ {
            "id" : 2523,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 2524,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 2525,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 2526,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 2527,
            "name" : "05_Validate Many Filter Same time (Exécution manuelle)"
          } ]
        }, {
          "id" : 582,
          "name" : "02_Validate Filter Activity",
          "steps" : [ {
            "id" : 2528,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 2529,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 2530,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 2531,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 2532,
            "name" : "05_Validate Many Filters Same time (Exécution Manuelle)"
          } ]
        } ]
      }, {
        "id" : 304,
        "name" : "06_Validate Short",
        "scenarios" : [ {
          "id" : 583,
          "name" : "01_Validate Short Department",
          "steps" : [ {
            "id" : 2533,
            "name" : "01_Validate Price per case Low to High"
          }, {
            "id" : 2534,
            "name" : "02_Validate Price per case High to Low"
          }, {
            "id" : 2535,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 2536,
            "name" : "04_Validatre Name Z to A"
          }, {
            "id" : 2537,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 2538,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        }, {
          "id" : 584,
          "name" : "02_Validate Short Activity",
          "steps" : [ {
            "id" : 2539,
            "name" : "01_Validate price per Case Low to High"
          }, {
            "id" : 2540,
            "name" : "02_Validate price per Case High to Low"
          }, {
            "id" : 2541,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 2542,
            "name" : "04_Validatre Name Z to A"
          }, {
            "id" : 2543,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 2544,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        } ]
      }, {
        "id" : 305,
        "name" : "07_Validate Article Page Content",
        "scenarios" : [ {
          "id" : 585,
          "name" : "01_Validate Department Article Page",
          "steps" : [ {
            "id" : 2545,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 2546,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 2547,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 2548,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 2549,
            "name" : "05_Validate Article title"
          }, {
            "id" : 2550,
            "name" : "06_Validate You may also like"
          } ]
        }, {
          "id" : 586,
          "name" : "02_Validate Activity Article Page",
          "steps" : [ {
            "id" : 2551,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 2552,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 2553,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 2554,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 2555,
            "name" : "05_Validate Article title"
          }, {
            "id" : 2556,
            "name" : "06_Validate You may also like"
          } ]
        } ]
      }, {
        "id" : 306,
        "name" : "08_Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 587,
          "name" : "01_UnMap And Delete Directory",
          "steps" : [ {
            "id" : 2557,
            "name" : "01_Log To UnMap"
          }, {
            "id" : 2558,
            "name" : "02_Un Map and Delete The Directory On Server And Virtual Machine"
          } ]
        }, {
          "id" : 588,
          "name" : "02_Close browser",
          "steps" : [ {
            "id" : 2559,
            "name" : "01_Logging of the Teardown"
          }, {
            "id" : 2560,
            "name" : "02_Close browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 84,
      "name" : "03_DWS (Desktop Shopping and Checkout FIREFOX EN)",
      "functionalities" : [ {
        "id" : 522,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 985,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 4492,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 4493,
            "name" : "Login Info"
          } ]
        }, {
          "id" : 986,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 4494,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 4495,
            "name" : "Logging of Setting Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 987,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 4496,
            "name" : "Open Browser With Type Of Browser And Selenium Hub"
          }, {
            "id" : 4497,
            "name" : "Log Information"
          } ]
        } ]
      }, {
        "id" : 523,
        "name" : "Validate An Anonymous Action",
        "scenarios" : [ {
          "id" : 988,
          "name" : "Validate Favorite",
          "steps" : [ {
            "id" : 4498,
            "name" : "Validate Favorite Header"
          }, {
            "id" : 4499,
            "name" : "Validate Adding an article to Wish list from Department Page"
          }, {
            "id" : 4500,
            "name" : "Validate Adding an article to Wish list from You may also like on Article Page"
          }, {
            "id" : 4501,
            "name" : "Validate Adding an article to Wish list from Search Results Page"
          }, {
            "id" : 4502,
            "name" : "Validate Adding an article to Wish list from Article Page"
          } ]
        } ]
      }, {
        "id" : 524,
        "name" : "Validate Guest User",
        "scenarios" : [ {
          "id" : 989,
          "name" : "Validate Guest User Place Order",
          "steps" : [ {
            "id" : 4503,
            "name" : "Validate messages for order placing"
          }, {
            "id" : 4504,
            "name" : "Validate Guest user uses same address for billing and shipping purposes - IN Validate messages for o"
          }, {
            "id" : 4505,
            "name" : "Validate Guest user uses a different address for billing and shipping purposes"
          }, {
            "id" : 4506,
            "name" : "Validate Guest user edits a shipping address"
          }, {
            "id" : 4507,
            "name" : "Validate Guest user edits a billing address"
          }, {
            "id" : 4508,
            "name" : "Validate Guest user adds a new shipping address - IN PREVIOUS CASES"
          }, {
            "id" : 4509,
            "name" : "Validate Guest user adds a new billing address - IN PREVIOUS CASES"
          } ]
        } ]
      }, {
        "id" : 525,
        "name" : "Validate Registered User",
        "scenarios" : [ {
          "id" : 990,
          "name" : "Validate A Registered Favorite List And Wish List Department",
          "steps" : [ {
            "id" : 4510,
            "name" : "Validate Add Wish List Article"
          }, {
            "id" : 4511,
            "name" : "Validate Share Favorite List"
          }, {
            "id" : 4512,
            "name" : "Validate Delete Wish List Article"
          }, {
            "id" : 4513,
            "name" : "Validate Empty Favorite List"
          }, {
            "id" : 4514,
            "name" : "Validate Account Side Menu Anglais"
          }, {
            "id" : 4515,
            "name" : "Validate Item Out Of Stock"
          }, {
            "id" : 4516,
            "name" : "Validate Wish List"
          }, {
            "id" : 4517,
            "name" : "Validate Minimum Order (150$ - QA) - NOT VALID IN STAGE"
          }, {
            "id" : 4518,
            "name" : "Validate Modify Case Quantity"
          }, {
            "id" : 4519,
            "name" : "Validate Checkout"
          }, {
            "id" : 4520,
            "name" : "Validate Add New Address for Checkout"
          } ]
        } ]
      }, {
        "id" : 526,
        "name" : "Validate AVS Response codes",
        "scenarios" : [ {
          "id" : 991,
          "name" : "AVS test Declined Cards",
          "steps" : [ {
            "id" : 4521,
            "name" : "Login"
          }, {
            "id" : 4522,
            "name" : "Go to Order Now page and fill in partial card information"
          }, {
            "id" : 4523,
            "name" : "4761739012345611 G International Card Detected"
          }, {
            "id" : 4524,
            "name" : "4761739012345629 I Address Verification Error The billing address was not verified with the card i"
          }, {
            "id" : 4525,
            "name" : "4761739012345645 N Address Verification Error The billing address and postal code do not match"
          }, {
            "id" : 4526,
            "name" : "4761739012345660 R Address Verification Error The billing address was not verified with the card iss"
          }, {
            "id" : 4527,
            "name" : "4761739012345694 C Address Verification Error Please ensure the billing address is correct or contac"
          }, {
            "id" : 4528,
            "name" : "4761739012345652 P Address Verification Error Please ensure the billing address is correct o"
          }, {
            "id" : 4529,
            "name" : "4761739012345728 Z Address Verification Error Please ensure the billing address is correct o"
          }, {
            "id" : 4530,
            "name" : "4761739012345678 A Address Verification Error Please ensure the billing postal code is correct or co"
          }, {
            "id" : 4531,
            "name" : "4761739012345686 B Address Verification Error Please ensure the billing postal code is corre"
          }, {
            "id" : 4532,
            "name" : "4761739012345751 S Address Verification Error Billing address verification is required"
          }, {
            "id" : 4533,
            "name" : "4761739012345744 U Address Verification Error Billing address verification is required"
          } ]
        } ]
      }, {
        "id" : 527,
        "name" : "Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 992,
          "name" : "Close Browser UnMap And Delete Directories",
          "steps" : [ {
            "id" : 4534,
            "name" : "Login information"
          }, {
            "id" : 4535,
            "name" : "Un Map and Delete The Directory"
          }, {
            "id" : 4536,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 52,
      "name" : "01_DWS (Desktop Product Catalog FireFox EN)",
      "functionalities" : [ {
        "id" : 291,
        "name" : "01_Setting Of Selenium, Browser And Variables",
        "scenarios" : [ {
          "id" : 557,
          "name" : "01_Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 2407,
            "name" : "01_Setting Variables (Data Repository)"
          }, {
            "id" : 2408,
            "name" : "02_Log for Data Repository"
          } ]
        }, {
          "id" : 558,
          "name" : "02_Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 2409,
            "name" : "01_Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 2410,
            "name" : "02_Logging of Setting Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 559,
          "name" : "03_Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 2411,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub"
          }, {
            "id" : 4777,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub amira"
          }, {
            "id" : 2412,
            "name" : "02_Log When Browser is opened"
          } ]
        } ]
      }, {
        "id" : 292,
        "name" : "02_Set Language English",
        "scenarios" : [ {
          "id" : 560,
          "name" : "01_Set Language English",
          "steps" : [ {
            "id" : 2413,
            "name" : "01_Set Language English"
          } ]
        } ]
      }, {
        "id" : 293,
        "name" : "03_Validate Content validation and Browse articles from home page",
        "scenarios" : [ {
          "id" : 561,
          "name" : "01_Validate Home Page",
          "steps" : [ {
            "id" : 2414,
            "name" : "01_Validate Sticky header"
          }, {
            "id" : 2415,
            "name" : "02_Validate Start shopping Button on Banner and the Shop now"
          } ]
        }, {
          "id" : 562,
          "name" : "02_Validate Header",
          "steps" : [ {
            "id" : 2416,
            "name" : "01_Validate Top Middle - Header"
          }, {
            "id" : 2417,
            "name" : "02_Validate Low - Header"
          } ]
        } ]
      }, {
        "id" : 294,
        "name" : "04_Validate Shop By Activity and Department - menu & sub-menu items",
        "scenarios" : [ {
          "id" : 563,
          "name" : "01_Validate All menu and sub-menu for Departments",
          "steps" : [ {
            "id" : 2418,
            "name" : "Validate menu for shop by Department"
          }, {
            "id" : 2419,
            "name" : "Validate Sub-menu for Cleaning"
          }, {
            "id" : 2420,
            "name" : "Validate Sub-menu for Clothing"
          }, {
            "id" : 2421,
            "name" : "Validate Sub-menu for Electronics"
          }, {
            "id" : 2422,
            "name" : "Validate Sub-menu for Food"
          }, {
            "id" : 2423,
            "name" : "Validate Sub-menu for Hardware"
          }, {
            "id" : 2424,
            "name" : "Validate Sub-menu for Health & Beauty"
          }, {
            "id" : 2425,
            "name" : "Validate Sub-menu for Home Decor"
          }, {
            "id" : 2426,
            "name" : "Validate Sub-menu for Kitchen"
          }, {
            "id" : 2427,
            "name" : "Validate Sub-menu for Kitchen (part 2 - Kitchen_Basics)"
          }, {
            "id" : 2428,
            "name" : "Validate Sub-menu for Office"
          }, {
            "id" : 2429,
            "name" : "Validate Sub-menu for Party"
          }, {
            "id" : 2430,
            "name" : "Validate Sub-menu for Pets"
          }, {
            "id" : 2431,
            "name" : "Validate Sub-menu for Toys"
          } ]
        }, {
          "id" : 564,
          "name" : "02_Validate All Menu and sub-menu Activity",
          "steps" : [ {
            "id" : 2432,
            "name" : "Validate menu roll down for Activity"
          }, {
            "id" : 2433,
            "name" : "Validate menu for shop by Activity"
          }, {
            "id" : 2434,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels"
          }, {
            "id" : 2435,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels (part 2)"
          }, {
            "id" : 2436,
            "name" : "Validate Sub-menu Event, Party & Wedding Planning"
          }, {
            "id" : 2437,
            "name" : "Validate Sub-menu Event, Party & Wedding Planning (part 2)"
          }, {
            "id" : 2438,
            "name" : "Validate Sub-menu Hospital & Care Facilities"
          }, {
            "id" : 2439,
            "name" : "Validate Sub-menu Hospital & Care Facilities (part 2)"
          }, {
            "id" : 2440,
            "name" : "Validate Sub-menu Maintenance"
          }, {
            "id" : 2441,
            "name" : "Validate Sub-menu Maintenance (part 2)"
          }, {
            "id" : 2442,
            "name" : "Validate Sub-menu Offices"
          }, {
            "id" : 2443,
            "name" : "Validate Sub-menu Offices (part 2)"
          }, {
            "id" : 2444,
            "name" : "Validate Sub-menu Schools"
          }, {
            "id" : 2445,
            "name" : "Validate Sub-menu Schools (part 2)"
          } ]
        } ]
      }, {
        "id" : 295,
        "name" : "05_Validate Filter",
        "scenarios" : [ {
          "id" : 565,
          "name" : "01_Validate Filter Department",
          "steps" : [ {
            "id" : 2446,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 2447,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 2448,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 2449,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 2450,
            "name" : "05_Validate Many Filter Same time"
          } ]
        }, {
          "id" : 566,
          "name" : "02_Validate Filter Activity",
          "steps" : [ {
            "id" : 2451,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 2452,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 2453,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 2454,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 2455,
            "name" : "05_Validate Many Filters Same time"
          } ]
        } ]
      }, {
        "id" : 296,
        "name" : "06_Validate Short",
        "scenarios" : [ {
          "id" : 567,
          "name" : "01_Validate Short Department",
          "steps" : [ {
            "id" : 2456,
            "name" : "01_Validate Price per case Low to High"
          }, {
            "id" : 2457,
            "name" : "02_Validate Price per case High to Low"
          }, {
            "id" : 2458,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 2459,
            "name" : "04_Validatre Name Z to A"
          }, {
            "id" : 2460,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 2461,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        }, {
          "id" : 568,
          "name" : "02_Validate Short Activity",
          "steps" : [ {
            "id" : 2462,
            "name" : "01_Validate price per Case Low to High"
          }, {
            "id" : 2463,
            "name" : "02_Validate price per Case High to Low"
          }, {
            "id" : 2464,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 2465,
            "name" : "04_Validatre Name Z to A"
          }, {
            "id" : 2466,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 2467,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        } ]
      }, {
        "id" : 297,
        "name" : "07_Validate Article Page Content",
        "scenarios" : [ {
          "id" : 569,
          "name" : "01_Validate Department Article Page",
          "steps" : [ {
            "id" : 2468,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 2469,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 2470,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 2471,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 2472,
            "name" : "05_Validate Article title"
          }, {
            "id" : 2473,
            "name" : "06_Validate You may also like"
          } ]
        }, {
          "id" : 570,
          "name" : "02_Validate Activity Article Page",
          "steps" : [ {
            "id" : 2474,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 2475,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 2476,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 2477,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 2478,
            "name" : "05_Validate Article title"
          }, {
            "id" : 2479,
            "name" : "06_Validate You may also like"
          } ]
        } ]
      }, {
        "id" : 298,
        "name" : "08_Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 571,
          "name" : "01_UnMap And Delete Directory",
          "steps" : [ {
            "id" : 2480,
            "name" : "01_Log To UnMap"
          }, {
            "id" : 2481,
            "name" : "02_Un Map and Delete The Directory On Server And Virtual Machine"
          } ]
        }, {
          "id" : 572,
          "name" : "02_Close browser",
          "steps" : [ {
            "id" : 2482,
            "name" : "01_Logging of the Teardown"
          }, {
            "id" : 2483,
            "name" : "02_Close browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 116,
      "name" : "Copy of OLD03-DWS Mobile Phone Android (Shopping and Checkout Chrome EN)(B)",
      "functionalities" : [ {
        "id" : 716,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 1317,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 5972,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 5973,
            "name" : "Login Info"
          } ]
        }, {
          "id" : 1318,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 5974,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 5975,
            "name" : "Logging of Setting Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 1319,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 5976,
            "name" : "Open Browser With Type Of Browser And Selenium Hub"
          }, {
            "id" : 5977,
            "name" : "Open Browser With Type Of Browser And Selenium Hub (Bujor)"
          }, {
            "id" : 5978,
            "name" : "Log Information"
          } ]
        } ]
      }, {
        "id" : 717,
        "name" : "Set Language English",
        "scenarios" : [ {
          "id" : 1320,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 5979,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 718,
        "name" : "Validate An Anonymous Action",
        "scenarios" : [ {
          "id" : 1321,
          "name" : "Validate Favorite",
          "steps" : [ {
            "id" : 5980,
            "name" : "Validate Favorite Header"
          }, {
            "id" : 5981,
            "name" : "Validate Adding an article to Wish list from Department Page"
          }, {
            "id" : 5982,
            "name" : "Validate Adding an article to Wish list from You may also like on Article Page"
          }, {
            "id" : 5983,
            "name" : "Validate Adding an article to Wish list from Search Results Page"
          }, {
            "id" : 5984,
            "name" : "Validate Adding an article to Wish list from Article Page"
          } ]
        } ]
      }, {
        "id" : 719,
        "name" : "Validate Guest User",
        "scenarios" : [ {
          "id" : 1322,
          "name" : "Validate Guest User Place Order",
          "steps" : [ {
            "id" : 5985,
            "name" : "Validate messages for order placing"
          }, {
            "id" : 5986,
            "name" : "Validate Guest user uses same address for billing and shipping purposes - IN Validate messages for o"
          }, {
            "id" : 5987,
            "name" : "Validate Guest user uses a different address for billing and shipping purposes"
          }, {
            "id" : 5988,
            "name" : "Validate Guest user edits a shipping address"
          }, {
            "id" : 5989,
            "name" : "Validate Guest user edits a billing address"
          }, {
            "id" : 5990,
            "name" : "Validate Guest user adds a new shipping address - IN PREVIOUS CASES"
          }, {
            "id" : 5991,
            "name" : "Validate Guest user adds a new billing address - IN PREVIOUS CASES"
          } ]
        } ]
      }, {
        "id" : 720,
        "name" : "Validate Registered User",
        "scenarios" : [ {
          "id" : 1323,
          "name" : "Validate A Registered Favorite List And Wish List Department",
          "steps" : [ {
            "id" : 5992,
            "name" : "Validate Add Wish List Article"
          }, {
            "id" : 5993,
            "name" : "Validate Share Favorite List"
          }, {
            "id" : 5994,
            "name" : "Validate Delete Wish List Article"
          }, {
            "id" : 5995,
            "name" : "Validate Empty Favorite List"
          }, {
            "id" : 5996,
            "name" : "Validate Account Side Menu Anglais"
          }, {
            "id" : 5997,
            "name" : "Validate Item Out Of Stock"
          }, {
            "id" : 5998,
            "name" : "Validate Wish List"
          }, {
            "id" : 5999,
            "name" : "Validate Minimum Order (150$ - QA) - NOT VALID IN STAGE"
          }, {
            "id" : 6000,
            "name" : "Validate Modify Case Quantity"
          }, {
            "id" : 6001,
            "name" : "Validate Checkout"
          }, {
            "id" : 6002,
            "name" : "Validate Add New Address for Checkout"
          } ]
        } ]
      }, {
        "id" : 721,
        "name" : "Validate AVS Response codes",
        "scenarios" : [ {
          "id" : 1324,
          "name" : "AVS test Declined Cards",
          "steps" : [ {
            "id" : 6003,
            "name" : "Login"
          }, {
            "id" : 6004,
            "name" : "Go to Order Now page and fill in partial card information"
          }, {
            "id" : 6005,
            "name" : "4761739012345611 G International Card Detected"
          }, {
            "id" : 6006,
            "name" : "4761739012345629 I Address Verification Error The billing address was not verified with the card i"
          }, {
            "id" : 6007,
            "name" : "4761739012345645 N Address Verification Error The billing address and postal code do not match"
          }, {
            "id" : 6008,
            "name" : "4761739012345660 R Address Verification Error The billing address was not verified with the card iss"
          }, {
            "id" : 6009,
            "name" : "4761739012345694 C Address Verification Error Please ensure the billing address is correct or contac"
          }, {
            "id" : 6010,
            "name" : "4761739012345652 P Address Verification Error Please ensure the billing address is correct o"
          }, {
            "id" : 6011,
            "name" : "4761739012345728 Z Address Verification Error Please ensure the billing address is correct o"
          }, {
            "id" : 6012,
            "name" : "4761739012345678 A Address Verification Error Please ensure the billing postal code is correct or co"
          }, {
            "id" : 6013,
            "name" : "4761739012345686 B Address Verification Error Please ensure the billing postal code is corre"
          }, {
            "id" : 6014,
            "name" : "4761739012345751 S Address Verification Error Billing address verification is required"
          }, {
            "id" : 6015,
            "name" : "4761739012345744 U Address Verification Error Billing address verification is required"
          } ]
        } ]
      }, {
        "id" : 722,
        "name" : "Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 1325,
          "name" : "Close Browser UnMap And Delete Directories",
          "steps" : [ {
            "id" : 6016,
            "name" : "Login information"
          }, {
            "id" : 6017,
            "name" : "Un Map and Delete The Directory"
          }, {
            "id" : 6018,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 141,
      "name" : "03-DWS Mobile Phone Android (Shopping and Checkout Chrome FR)(Bujor)",
      "functionalities" : [ {
        "id" : 852,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 1599,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 7140,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 7141,
            "name" : "Login Info"
          } ]
        }, {
          "id" : 1600,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 7142,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 7143,
            "name" : "Logging of Setting Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 1601,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 7144,
            "name" : "Open Browser With Type Of Browser And Selenium Hub"
          }, {
            "id" : 7145,
            "name" : "Open Browser With Type Of Browser And Selenium Hub (Bujor)"
          }, {
            "id" : 7146,
            "name" : "Log Information"
          } ]
        } ]
      }, {
        "id" : 853,
        "name" : "Set Language English",
        "scenarios" : [ {
          "id" : 1602,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 7147,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 854,
        "name" : "Validate An Anonymous Action",
        "scenarios" : [ {
          "id" : 1603,
          "name" : "Validate Favorite",
          "steps" : [ {
            "id" : 7148,
            "name" : "Validate Favorite Header"
          }, {
            "id" : 7149,
            "name" : "Validate Adding an article to Wish list from Department Page"
          }, {
            "id" : 7150,
            "name" : "Validate Adding an article to Wish list from You may also like on Article Page"
          }, {
            "id" : 7151,
            "name" : "Validate Adding an article to Wish list from Search Results Page"
          }, {
            "id" : 7152,
            "name" : "Validate Adding an article to Wish list from Article Page"
          } ]
        } ]
      }, {
        "id" : 855,
        "name" : "Validate Guest User",
        "scenarios" : [ {
          "id" : 1604,
          "name" : "Validate Guest User Place Order",
          "steps" : [ {
            "id" : 7153,
            "name" : "Validate messages for order placing"
          }, {
            "id" : 7154,
            "name" : "Validate Guest user uses same address for billing and shipping purposes - IN Validate messages for o"
          }, {
            "id" : 7155,
            "name" : "Validate Guest user uses a different address for billing and shipping purposes"
          }, {
            "id" : 7156,
            "name" : "Validate Guest user edits a shipping address"
          }, {
            "id" : 7157,
            "name" : "Validate Guest user edits a billing address F"
          }, {
            "id" : 7158,
            "name" : "Validate Guest user adds a new shipping address - IN PREVIOUS CASES"
          }, {
            "id" : 7159,
            "name" : "Validate Guest user adds a new billing address - IN PREVIOUS CASES"
          } ]
        } ]
      }, {
        "id" : 856,
        "name" : "Validate Registered User",
        "scenarios" : [ {
          "id" : 1605,
          "name" : "Validate A Registered Favorite List And Wish List Department",
          "steps" : [ {
            "id" : 7160,
            "name" : "Validate Add Wish List Article"
          }, {
            "id" : 7161,
            "name" : "Validate Share Favorite List"
          }, {
            "id" : 7162,
            "name" : "Validate Delete Wish List Article"
          }, {
            "id" : 7163,
            "name" : "Validate Empty Favorite List"
          }, {
            "id" : 7164,
            "name" : "Validate Account Side Menu Anglais"
          }, {
            "id" : 7165,
            "name" : "Validate Item Out Of Stock"
          }, {
            "id" : 7166,
            "name" : "Validate Wish List"
          }, {
            "id" : 7167,
            "name" : "Validate Minimum Order (150$ - QA) - NOT VALID IN STAGE"
          }, {
            "id" : 7168,
            "name" : "Validate Modify Case Quantity"
          }, {
            "id" : 7169,
            "name" : "Validate Checkout"
          }, {
            "id" : 7170,
            "name" : "Validate Add New Address for Checkout"
          } ]
        } ]
      }, {
        "id" : 857,
        "name" : "Validate AVS Response codes",
        "scenarios" : [ {
          "id" : 1606,
          "name" : "AVS test Declined Cards",
          "steps" : [ {
            "id" : 7171,
            "name" : "Login"
          }, {
            "id" : 7172,
            "name" : "Go to Order Now page and fill in partial card information"
          }, {
            "id" : 7173,
            "name" : "4761739012345611 G International Card Detected"
          }, {
            "id" : 7174,
            "name" : "4761739012345629 I Address Verification Error The billing address was not verified with the card i"
          }, {
            "id" : 7175,
            "name" : "4761739012345645 N Address Verification Error The billing address and postal code do not match"
          }, {
            "id" : 7176,
            "name" : "4761739012345660 R Address Verification Error The billing address was not verified with the card iss"
          }, {
            "id" : 7177,
            "name" : "4761739012345694 C Address Verification Error Please ensure the billing address is correct or contac"
          }, {
            "id" : 7178,
            "name" : "4761739012345652 P Address Verification Error Please ensure the billing address is correct o"
          }, {
            "id" : 7179,
            "name" : "4761739012345728 Z Address Verification Error Please ensure the billing address is correct o"
          }, {
            "id" : 7180,
            "name" : "4761739012345678 A Address Verification Error Please ensure the billing postal code is correct or co"
          }, {
            "id" : 7181,
            "name" : "4761739012345686 B Address Verification Error Please ensure the billing postal code is corre"
          }, {
            "id" : 7182,
            "name" : "4761739012345751 S Address Verification Error Billing address verification is required"
          }, {
            "id" : 7183,
            "name" : "4761739012345744 U Address Verification Error Billing address verification is required"
          } ]
        } ]
      }, {
        "id" : 858,
        "name" : "Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 1607,
          "name" : "Close Browser UnMap And Delete Directories",
          "steps" : [ {
            "id" : 7184,
            "name" : "Login information"
          }, {
            "id" : 7185,
            "name" : "Un Map and Delete The Directory"
          }, {
            "id" : 7186,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 79,
      "name" : "01-Mobile iOS (iPhone Product Catalog Safari EN) (Yves)",
      "functionalities" : [ {
        "id" : 486,
        "name" : "01_Setting Of Selenium, Browser And Variables",
        "scenarios" : [ {
          "id" : 921,
          "name" : "01_Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 4160,
            "name" : "01_Setting Variables (Data Repository)"
          }, {
            "id" : 4161,
            "name" : "02_Log for Data Repository"
          } ]
        }, {
          "id" : 922,
          "name" : "03_Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 4162,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub Physique"
          }, {
            "id" : 4163,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub Simulator"
          }, {
            "id" : 4164,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub Simulator MacDev1 iPhone5s"
          }, {
            "id" : 4237,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub Simulator iPhone7 LOCAL YVES"
          }, {
            "id" : 6501,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub Simulator ipad LOCAL YVES"
          }, {
            "id" : 4538,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub Simulator MacDev1 iPhone7 Simulateur"
          }, {
            "id" : 5915,
            "name" : "Open Browser With Type Of Browser And Selenium Hub Simulator MacDev2 iPhone7 Simulateur"
          }, {
            "id" : 4165,
            "name" : "02_Log When Browser is opened"
          } ]
        } ]
      }, {
        "id" : 487,
        "name" : "02_Set Language English",
        "scenarios" : [ {
          "id" : 923,
          "name" : "01_Set Language English",
          "steps" : [ {
            "id" : 4166,
            "name" : "01_Set Language English"
          } ]
        } ]
      }, {
        "id" : 488,
        "name" : "03_Validate Content validation and Browse articles from home page",
        "scenarios" : [ {
          "id" : 924,
          "name" : "01_Validate Home Page",
          "steps" : [ {
            "id" : 4167,
            "name" : "01_Validate Sticky header"
          }, {
            "id" : 4168,
            "name" : "02_Validate Start shopping Button on Banner and the Shop now"
          } ]
        }, {
          "id" : 925,
          "name" : "02_Validate Header",
          "steps" : [ {
            "id" : 4169,
            "name" : "01_Validate Top Middle - Header"
          }, {
            "id" : 4170,
            "name" : "02_Validate Low - Header"
          } ]
        } ]
      }, {
        "id" : 489,
        "name" : "04_Validate Shop By Activity and Department - menu & sub-menu items",
        "scenarios" : [ {
          "id" : 926,
          "name" : "01_Validate All menu and sub-menu for Departments",
          "steps" : [ {
            "id" : 4171,
            "name" : "Validate Sub-menu for Cleaning"
          }, {
            "id" : 4172,
            "name" : "Validate Sub-menu for Clothing"
          }, {
            "id" : 4173,
            "name" : "Validate Sub-menu for Electronics"
          }, {
            "id" : 4174,
            "name" : "Validate Sub-menu for Food"
          }, {
            "id" : 4175,
            "name" : "Validate Sub-menu for Hardware"
          }, {
            "id" : 4176,
            "name" : "Validate Sub-menu for Health & Beauty"
          }, {
            "id" : 4177,
            "name" : "Validate Sub-menu for Home Decor"
          }, {
            "id" : 4178,
            "name" : "Validate Sub-menu for Kitchen"
          }, {
            "id" : 4179,
            "name" : "Validate Sub-menu for Office"
          }, {
            "id" : 4180,
            "name" : "Validate Sub-menu for Party"
          }, {
            "id" : 4181,
            "name" : "Validate Sub-menu for Pets"
          }, {
            "id" : 4182,
            "name" : "Validate Sub-menu for Toys"
          } ]
        }, {
          "id" : 927,
          "name" : "02_Validate All Menu and sub-menu Activity",
          "steps" : [ {
            "id" : 5969,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels (test)"
          }, {
            "id" : 5967,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels"
          }, {
            "id" : 4186,
            "name" : "Validate Sub-menu Event, Party & Wedding Planning"
          }, {
            "id" : 5964,
            "name" : "Validate Sub-menu Hospitals & Care Facilities(With out FOOD)"
          }, {
            "id" : 5971,
            "name" : "Validate Sub-menu Maintenance"
          }, {
            "id" : 6019,
            "name" : "Validate Sub-menu Offices"
          }, {
            "id" : 6020,
            "name" : "Validate Sub-menu Schools"
          } ]
        } ]
      }, {
        "id" : 490,
        "name" : "05_Validate Filter",
        "scenarios" : [ {
          "id" : 928,
          "name" : "01_Validate Filter Department",
          "steps" : [ {
            "id" : 4191,
            "name" : "01_Validate See More And Less(Complet)"
          }, {
            "id" : 4192,
            "name" : "02_Validate Filter By Departments"
          }, {
            "id" : 4193,
            "name" : "03_Validate Filter by Business"
          }, {
            "id" : 4194,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 4195,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 4196,
            "name" : "05_Validate Many Filter Same time"
          } ]
        }, {
          "id" : 929,
          "name" : "02_Validate Filter Activity",
          "steps" : [ {
            "id" : 4197,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 4198,
            "name" : "02_Validate Filter By DepartmentsBK"
          }, {
            "id" : 4199,
            "name" : "03_Validate Filter by Business"
          }, {
            "id" : 4200,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 4201,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 4202,
            "name" : "05_Validate Many Filter Same time"
          }, {
            "id" : 7209,
            "name" : "Copy of 02_Validate Filter By Departments"
          } ]
        }, {
          "id" : 930,
          "name" : "02_Validate Filter ActivityOLD",
          "steps" : [ {
            "id" : 4203,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 4204,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 4205,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 4206,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 4207,
            "name" : "05_Validate Many Filters Same time"
          } ]
        } ]
      }, {
        "id" : 491,
        "name" : "06_Validate Short",
        "scenarios" : [ {
          "id" : 931,
          "name" : "01_Validate Short Department",
          "steps" : [ {
            "id" : 4208,
            "name" : "01_Validate Price per case Low to High"
          }, {
            "id" : 4209,
            "name" : "02_Validate Price per case High to Low"
          }, {
            "id" : 4210,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 4211,
            "name" : "04_Validate Name Z to A"
          }, {
            "id" : 4212,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 4213,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        }, {
          "id" : 932,
          "name" : "02_Validate Short Activity",
          "steps" : [ {
            "id" : 4214,
            "name" : "01_Validate price per Case Low to High"
          }, {
            "id" : 4215,
            "name" : "02_Validate price per Case High to Low"
          }, {
            "id" : 4216,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 4217,
            "name" : "04_Validatre Name Z to A"
          }, {
            "id" : 4218,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 4219,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        } ]
      }, {
        "id" : 492,
        "name" : "07_Validate Article Page Content",
        "scenarios" : [ {
          "id" : 933,
          "name" : "01_Validate Department Article Page",
          "steps" : [ {
            "id" : 4220,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 4221,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 4222,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 4223,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 4224,
            "name" : "05_Validate Article title"
          }, {
            "id" : 4225,
            "name" : "06_Validate You may also like"
          }, {
            "id" : 4226,
            "name" : "Copy of 03_Validate Add Favorite in article page"
          } ]
        }, {
          "id" : 934,
          "name" : "02_Validate Activity Article Page",
          "steps" : [ {
            "id" : 4227,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 4228,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 4229,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 4230,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 4231,
            "name" : "05_Validate Article title"
          }, {
            "id" : 4232,
            "name" : "06_Validate You may also like"
          } ]
        } ]
      }, {
        "id" : 493,
        "name" : "08_Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 935,
          "name" : "01_UnMap And Delete Directory",
          "steps" : [ {
            "id" : 4233,
            "name" : "01_Log To UnMap"
          }, {
            "id" : 4234,
            "name" : "02_Un Map and Delete The Directory On Server And Virtual Machine"
          } ]
        }, {
          "id" : 936,
          "name" : "02_Close browser",
          "steps" : [ {
            "id" : 4235,
            "name" : "01_Logging of the Teardown"
          }, {
            "id" : 4236,
            "name" : "02_Close Application Mobile"
          } ]
        } ]
      } ]
    }, {
      "id" : 68,
      "name" : "99-DWS (Desktop Product Catalog IE FR)_BACKUP",
      "functionalities" : [ {
        "id" : 401,
        "name" : "01_Setting Of Selenium, Browser And Variables",
        "scenarios" : [ {
          "id" : 760,
          "name" : "01_Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 3351,
            "name" : "01_Setting Variables (Data Repository)"
          }, {
            "id" : 3352,
            "name" : "02_Log for Data Repository"
          } ]
        }, {
          "id" : 761,
          "name" : "02_Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 3353,
            "name" : "01_Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 3354,
            "name" : "02_Logging of Setting Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 762,
          "name" : "03_Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 3355,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub"
          }, {
            "id" : 3356,
            "name" : "02_Log When Browser is opened"
          } ]
        } ]
      }, {
        "id" : 402,
        "name" : "02_Set Language French",
        "scenarios" : [ {
          "id" : 763,
          "name" : "01_Set Language French",
          "steps" : [ {
            "id" : 3357,
            "name" : "01_Set Language French"
          } ]
        } ]
      }, {
        "id" : 403,
        "name" : "03_Validate Content validation and Browse articles from home page",
        "scenarios" : [ {
          "id" : 764,
          "name" : "01_Validate Home Page",
          "steps" : [ {
            "id" : 3358,
            "name" : "01_Validate Sticky header"
          }, {
            "id" : 3359,
            "name" : "02_Validate Start shopping Button on Banner and the Shop now"
          } ]
        }, {
          "id" : 765,
          "name" : "02_Validate Header",
          "steps" : [ {
            "id" : 3360,
            "name" : "01_Validate Top Middle - Header"
          }, {
            "id" : 3361,
            "name" : "02_Validate Low - Header"
          } ]
        } ]
      }, {
        "id" : 404,
        "name" : "04_Validate Shop By Activity and Department - menu & sub-menu items",
        "scenarios" : [ {
          "id" : 766,
          "name" : "01_Validate All menu and sub-menu for Departments",
          "steps" : [ {
            "id" : 3362,
            "name" : "Validate menu for shop by Department"
          }, {
            "id" : 3363,
            "name" : "Validate Sub-menu for Food (Alimentation)"
          }, {
            "id" : 3364,
            "name" : "Validate Sub-menu for Pets (Animaux)"
          }, {
            "id" : 3365,
            "name" : "Validate Sub-menu for Pets (Animaux) - Part 2"
          }, {
            "id" : 3366,
            "name" : "Validate Sub-menu for Party (Célébrations)"
          }, {
            "id" : 3367,
            "name" : "Validate Sub-menu for Party (Célébrations) - Part 2"
          }, {
            "id" : 3368,
            "name" : "Validate Sub-menu for Kitchen (Cuisine)"
          }, {
            "id" : 3369,
            "name" : "Validate Sub-menu for Kitchen (Cuisine) - Part 2"
          }, {
            "id" : 3370,
            "name" : "Validate Sub-menu for Electronics (Électronique)"
          }, {
            "id" : 3371,
            "name" : "Validate Sub-menu for Electronics (Électronique) - Part 2"
          }, {
            "id" : 3372,
            "name" : "Validate Sub-menu for Office (Fournitures de bureau)"
          }, {
            "id" : 3373,
            "name" : "Validate Sub-menu for Office (Fournitures de bureau) - Part 2"
          }, {
            "id" : 3374,
            "name" : "Validate Sub-menu for Toys (Jouets)"
          }, {
            "id" : 3375,
            "name" : "Validate Sub-menu for Home Decor (Maison)"
          }, {
            "id" : 3376,
            "name" : "Validate Sub-menu for Home Decor (Maison) - Part 2"
          }, {
            "id" : 3377,
            "name" : "Validate Sub-menu for Cleaning (Produits ménagers)"
          }, {
            "id" : 3378,
            "name" : "Validate Sub-menu for Cleaning (Produits ménagers) - Part 2"
          }, {
            "id" : 3379,
            "name" : "Validate Sub-menu for Hardware (Quincaillerie)"
          }, {
            "id" : 3380,
            "name" : "Validate Sub-menu for Cleaning (Quincaillerie) - Part 2"
          }, {
            "id" : 3381,
            "name" : "Validate Sub-menu for Health & Beauty (Santé & beauté)"
          }, {
            "id" : 3382,
            "name" : "Validate Sub-menu for Health & Beauty (Santé & Beauté) - Part 2"
          }, {
            "id" : 3383,
            "name" : "Validate Sub-menu for Clothing (Vêtements)"
          } ]
        }, {
          "id" : 767,
          "name" : "02_Validate All Menu and sub-menu Activity",
          "steps" : [ {
            "id" : 3384,
            "name" : "Validate menu roll down for Activity"
          }, {
            "id" : 3385,
            "name" : "Validate menu for shop by Activity"
          }, {
            "id" : 3386,
            "name" : "Validate Sub-menu Offices (Bureaux)"
          }, {
            "id" : 3387,
            "name" : "Validate Sub-menu Schools (Écoles)"
          }, {
            "id" : 3388,
            "name" : "Validate Sub-menu Maintenance (Entretien général)"
          }, {
            "id" : 3389,
            "name" : "Validate Sub-menu Maintenance (Entretien général) - Part 2"
          }, {
            "id" : 3390,
            "name" : "Validate Sub-menu Event, Party & Wedding Planning (Événements, fêtes et organisation de mariages)"
          }, {
            "id" : 3391,
            "name" : "Validate Sub-menu EPWP (Événements, fêtes et organisation de mariages) - Part 2"
          }, {
            "id" : 3392,
            "name" : "Validate Sub-menu Hospital & Care Facilities (Hôpitaux et établissements de soins)"
          }, {
            "id" : 3393,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels (Traiteurs, restaurants et hôtels)"
          }, {
            "id" : 3394,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels (Traiteurs, restaurants et hôtels) - Part 2"
          } ]
        } ]
      }, {
        "id" : 405,
        "name" : "05_Validate Filter",
        "scenarios" : [ {
          "id" : 768,
          "name" : "01_Validate Filter Department",
          "steps" : [ {
            "id" : 3395,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 3396,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 3397,
            "name" : "03_Validate Filter by Brand (Marque)"
          }, {
            "id" : 3398,
            "name" : "04_Validate Filter by Unit Price (Prix unitaire)"
          }, {
            "id" : 3399,
            "name" : "05_Validate Many Filter Same time"
          } ]
        }, {
          "id" : 769,
          "name" : "02_Validate Filter Activity",
          "steps" : [ {
            "id" : 3400,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 3401,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 3402,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 3403,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 3404,
            "name" : "05_Validate Many Filters Same time"
          } ]
        } ]
      }, {
        "id" : 406,
        "name" : "06_Validate Short",
        "scenarios" : [ {
          "id" : 770,
          "name" : "01_Validate Short Department",
          "steps" : [ {
            "id" : 3405,
            "name" : "01_Validate Price per case Low to High"
          }, {
            "id" : 3406,
            "name" : "02_Validate Price per case High to Low"
          }, {
            "id" : 3407,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 3408,
            "name" : "04_Validatre Name Z to A"
          }, {
            "id" : 3409,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 3410,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        }, {
          "id" : 771,
          "name" : "02_Validate Short Activity",
          "steps" : [ {
            "id" : 3411,
            "name" : "01_Validate price per Case Low to High"
          }, {
            "id" : 3412,
            "name" : "02_Validate price per Case High to Low"
          }, {
            "id" : 3413,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 3414,
            "name" : "04_Validatre Name Z to A"
          }, {
            "id" : 3415,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 3416,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        } ]
      }, {
        "id" : 407,
        "name" : "07_Validate Article Page Content",
        "scenarios" : [ {
          "id" : 772,
          "name" : "01_Validate Department Article Page",
          "steps" : [ {
            "id" : 3417,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 3418,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 3419,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 3420,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 3421,
            "name" : "05_Validate Article title"
          }, {
            "id" : 3422,
            "name" : "06_Validate You may also like"
          } ]
        }, {
          "id" : 773,
          "name" : "02_Validate Activity Article Page",
          "steps" : [ {
            "id" : 3423,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 3424,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 3425,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 3426,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 3427,
            "name" : "05_Validate Article title"
          }, {
            "id" : 3428,
            "name" : "06_Validate You may also like"
          } ]
        } ]
      }, {
        "id" : 408,
        "name" : "08_Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 774,
          "name" : "01_UnMap And Delete Directory",
          "steps" : [ {
            "id" : 3429,
            "name" : "01_Log To UnMap"
          }, {
            "id" : 3430,
            "name" : "02_Un Map and Delete The Directory On Server And Virtual Machine"
          } ]
        }, {
          "id" : 775,
          "name" : "02_Close browser",
          "steps" : [ {
            "id" : 3431,
            "name" : "01_Logging of the Teardown"
          }, {
            "id" : 3432,
            "name" : "02_Close browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 90,
      "name" : "99-DWS (Desktop My Account QA InternetExplorer EN)",
      "functionalities" : [ {
        "id" : 560,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 1043,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 4779,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 4780,
            "name" : "Log Setting Variables (Data Repository)"
          } ]
        }, {
          "id" : 1044,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 4781,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 4782,
            "name" : "Log Of Setting Selenium Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 1045,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 4783,
            "name" : "Setting The Opening Of Browser With Selenium Hub"
          } ]
        } ]
      }, {
        "id" : 561,
        "name" : "Set Language English",
        "scenarios" : [ {
          "id" : 1046,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 4784,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 562,
        "name" : "Validate My Account",
        "scenarios" : [ {
          "id" : 1047,
          "name" : "Validate Login Functions",
          "steps" : [ {
            "id" : 4785,
            "name" : "Validate Login Logout"
          }, {
            "id" : 4786,
            "name" : "Validate Login Forgot Password"
          } ]
        }, {
          "id" : 1048,
          "name" : "Validate User",
          "steps" : [ {
            "id" : 4787,
            "name" : "Validate User Creation"
          }, {
            "id" : 4788,
            "name" : "Validate User Address Creation"
          } ]
        }, {
          "id" : 1049,
          "name" : "Validate Page Account",
          "steps" : [ {
            "id" : 4789,
            "name" : "Validate Create Blank Account"
          }, {
            "id" : 4790,
            "name" : "Validate Create Account With Invalid Data"
          }, {
            "id" : 4791,
            "name" : "Validate User Register Account Invalid Password"
          }, {
            "id" : 4792,
            "name" : "Validate User Register Account Different Password"
          }, {
            "id" : 4793,
            "name" : "Validate Logged User Shopping Cart Remember"
          }, {
            "id" : 4794,
            "name" : "Validate Modify Account And information French"
          }, {
            "id" : 4795,
            "name" : "Validate Modify Account And information English"
          }, {
            "id" : 4796,
            "name" : "Validate information into Login page"
          }, {
            "id" : 4797,
            "name" : "Validate Stay in checkbox"
          }, {
            "id" : 4798,
            "name" : "Validate Forgot password xxx(Inclu dans Validate Login Functions) xxx"
          } ]
        } ]
      }, {
        "id" : 563,
        "name" : "Close Browser",
        "scenarios" : [ {
          "id" : 1050,
          "name" : "Close Browser",
          "steps" : [ {
            "id" : 4799,
            "name" : "Log Of Closing Browser"
          }, {
            "id" : 4800,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 94,
      "name" : "99-DWS (Desktop My Account QA InternetExplorer FR)",
      "functionalities" : [ {
        "id" : 576,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 1075,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 4868,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 4869,
            "name" : "Log Setting Variables (Data Repository)"
          } ]
        }, {
          "id" : 1076,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 4870,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 4871,
            "name" : "Log Of Setting Selenium Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 1077,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 4872,
            "name" : "Setting The Opening Of Browser With Selenium Hub"
          } ]
        } ]
      }, {
        "id" : 577,
        "name" : "Set Language English",
        "scenarios" : [ {
          "id" : 1078,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 4873,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 578,
        "name" : "Validate My Account",
        "scenarios" : [ {
          "id" : 1079,
          "name" : "Validate Login Functions",
          "steps" : [ {
            "id" : 4874,
            "name" : "Validate Login Logout"
          }, {
            "id" : 4875,
            "name" : "Validate Login Forgot Password"
          } ]
        }, {
          "id" : 1080,
          "name" : "Validate User",
          "steps" : [ {
            "id" : 4876,
            "name" : "Validate User Creation"
          }, {
            "id" : 4877,
            "name" : "Validate User Address Creation"
          } ]
        }, {
          "id" : 1081,
          "name" : "Validate Page Account",
          "steps" : [ {
            "id" : 4878,
            "name" : "Validate Create Blank Account"
          }, {
            "id" : 4879,
            "name" : "Validate Create Account With Invalid Data"
          }, {
            "id" : 4880,
            "name" : "Validate User Register Account Invalid Password"
          }, {
            "id" : 4881,
            "name" : "Validate User Register Account Different Password"
          }, {
            "id" : 4882,
            "name" : "Validate Logged User Shopping Cart Remember"
          }, {
            "id" : 4883,
            "name" : "Validate Modify Account And information English"
          }, {
            "id" : 4884,
            "name" : "Validate Modify Account And information French"
          }, {
            "id" : 4885,
            "name" : "Validate information into Login page"
          }, {
            "id" : 4886,
            "name" : "Validate Stay in checkbox"
          }, {
            "id" : 4887,
            "name" : "Validate Forgot password xxx(Inclu dans Validate Login Functions) xxx"
          } ]
        } ]
      }, {
        "id" : 579,
        "name" : "Close Browser",
        "scenarios" : [ {
          "id" : 1082,
          "name" : "Close Browser",
          "steps" : [ {
            "id" : 4888,
            "name" : "Log Of Closing Browser"
          }, {
            "id" : 4889,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 107,
      "name" : "02_DWS (Desktop My Account Safari EN )",
      "functionalities" : [ {
        "id" : 657,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 1210,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 5486,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 5487,
            "name" : "Log Setting Variables (Data Repository)"
          } ]
        }, {
          "id" : 1211,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 5488,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 5489,
            "name" : "Log Of Setting Selenium Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 1212,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 5490,
            "name" : "Setting The Opening Of Browser With Selenium Hub"
          } ]
        } ]
      }, {
        "id" : 658,
        "name" : "Set Language English",
        "scenarios" : [ {
          "id" : 1213,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 5491,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 659,
        "name" : "Validate My Account",
        "scenarios" : [ {
          "id" : 1214,
          "name" : "Validate Login Functions",
          "steps" : [ {
            "id" : 5492,
            "name" : "Validate Login Logout"
          }, {
            "id" : 5493,
            "name" : "Validate Login Forgot Password"
          } ]
        }, {
          "id" : 1215,
          "name" : "Validate User",
          "steps" : [ {
            "id" : 5494,
            "name" : "Validate User Creation"
          }, {
            "id" : 5495,
            "name" : "Validate User Address Creation"
          } ]
        }, {
          "id" : 1216,
          "name" : "Validate Page Account",
          "steps" : [ {
            "id" : 5496,
            "name" : "Validate Create Blank Account"
          }, {
            "id" : 5497,
            "name" : "Validate Create Account With Invalid Data"
          }, {
            "id" : 5498,
            "name" : "Validate User Register Account Invalid Password"
          }, {
            "id" : 5499,
            "name" : "Validate User Register Account Different Password"
          }, {
            "id" : 5500,
            "name" : "Validate Logged User Shopping Cart Remember"
          }, {
            "id" : 5501,
            "name" : "Validate Modify Account And information French"
          }, {
            "id" : 5502,
            "name" : "Validate Modify Account And information English"
          }, {
            "id" : 5503,
            "name" : "Validate information into Login page"
          }, {
            "id" : 5504,
            "name" : "Validate Stay in checkbox"
          }, {
            "id" : 5505,
            "name" : "Validate Forgot password xxx(Inclu dans Validate Login Functions) xxx"
          } ]
        } ]
      }, {
        "id" : 660,
        "name" : "Close Browser",
        "scenarios" : [ {
          "id" : 1217,
          "name" : "Close Browser",
          "steps" : [ {
            "id" : 5506,
            "name" : "Log Of Closing Browser"
          }, {
            "id" : 5507,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 7,
      "name" : "03_DWS (Desktop Shopping and Checkout Chrome EN)",
      "functionalities" : [ {
        "id" : 193,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 368,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 1649,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 1753,
            "name" : "Login Info"
          } ]
        }, {
          "id" : 367,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 1648,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 1650,
            "name" : "Logging of Setting Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 369,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 1651,
            "name" : "Open Browser With Type Of Browser And Selenium Hub"
          }, {
            "id" : 1754,
            "name" : "Log Information"
          } ]
        } ]
      }, {
        "id" : 599,
        "name" : "Set Language English",
        "scenarios" : [ {
          "id" : 1116,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 5039,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 126,
        "name" : "Validate An Anonymous Action",
        "scenarios" : [ {
          "id" : 228,
          "name" : "Validate Favorite",
          "steps" : [ {
            "id" : 881,
            "name" : "Validate Favorite Header"
          }, {
            "id" : 1733,
            "name" : "Validate Adding an article to Wish list from Department Page"
          }, {
            "id" : 1734,
            "name" : "Validate Adding an article to Wish list from You may also like on Article Page"
          }, {
            "id" : 1735,
            "name" : "Validate Adding an article to Wish list from Search Results Page"
          }, {
            "id" : 1737,
            "name" : "Validate Adding an article to Wish list from Article Page"
          } ]
        } ]
      }, {
        "id" : 127,
        "name" : "Validate Guest User",
        "scenarios" : [ {
          "id" : 312,
          "name" : "Validate Guest User Place Order",
          "steps" : [ {
            "id" : 1417,
            "name" : "Validate messages for order placing"
          }, {
            "id" : 1420,
            "name" : "Validate Guest user uses same address for billing and shipping purposes - IN Validate messages for o"
          }, {
            "id" : 2183,
            "name" : "Validate Guest user uses a different address for billing and shipping purposes"
          }, {
            "id" : 2304,
            "name" : "Validate Guest user edits a shipping address (changer par client)"
          }, {
            "id" : 2305,
            "name" : "Validate Guest user edits a billing address"
          }, {
            "id" : 1422,
            "name" : "Validate Guest user adds a new shipping address - IN PREVIOUS CASES"
          }, {
            "id" : 1424,
            "name" : "Validate Guest user adds a new billing address - IN PREVIOUS CASES"
          } ]
        } ]
      }, {
        "id" : 125,
        "name" : "Validate Registered User",
        "scenarios" : [ {
          "id" : 229,
          "name" : "Validate A Registered Favorite List And Wish List Department",
          "steps" : [ {
            "id" : 884,
            "name" : "Validate Add Wish List Article"
          }, {
            "id" : 895,
            "name" : "Validate Share Favorite List"
          }, {
            "id" : 894,
            "name" : "Validate Delete Wish List Article"
          }, {
            "id" : 896,
            "name" : "Validate Empty Favorite List"
          }, {
            "id" : 897,
            "name" : "Validate Account Side Menu Anglais"
          }, {
            "id" : 899,
            "name" : "Validate Item Out Of Stock"
          }, {
            "id" : 900,
            "name" : "Validate Wish List"
          }, {
            "id" : 902,
            "name" : "Validate Minimum Order (150$ - QA) - NOT VALID IN STAGE"
          }, {
            "id" : 901,
            "name" : "Validate Modify Case Quantity"
          }, {
            "id" : 1412,
            "name" : "Validate Checkout"
          }, {
            "id" : 1415,
            "name" : "Validate Add New Address for Checkout"
          } ]
        } ]
      }, {
        "id" : 188,
        "name" : "Validate AVS Response codes",
        "scenarios" : [ {
          "id" : 359,
          "name" : "AVS test Declined Cards",
          "steps" : [ {
            "id" : 1898,
            "name" : "Login"
          }, {
            "id" : 1628,
            "name" : "Go to Order Now page and fill in partial card information"
          }, {
            "id" : 1634,
            "name" : "4761739012345611 G International Card Detected"
          }, {
            "id" : 2009,
            "name" : "4761739012345629 I Address Verification Error The billing address was not verified with the card i"
          }, {
            "id" : 2088,
            "name" : "4761739012345645 N Address Verification Error The billing address and postal code do not match"
          }, {
            "id" : 2089,
            "name" : "4761739012345660 R Address Verification Error The billing address was not verified with the card iss"
          }, {
            "id" : 2090,
            "name" : "4761739012345694 C Address Verification Error Please ensure the billing address is correct or contac"
          }, {
            "id" : 2091,
            "name" : "4761739012345652 P Address Verification Error Please ensure the billing address is correct o"
          }, {
            "id" : 2092,
            "name" : "4761739012345728 Z Address Verification Error Please ensure the billing address is correct o"
          }, {
            "id" : 2093,
            "name" : "4761739012345678 A Address Verification Error Please ensure the billing postal code is correct or co"
          }, {
            "id" : 2094,
            "name" : "4761739012345686 B Address Verification Error Please ensure the billing postal code is corre"
          }, {
            "id" : 2095,
            "name" : "4761739012345751 S Address Verification Error Billing address verification is required"
          }, {
            "id" : 2096,
            "name" : "4761739012345744 U Address Verification Error Billing address verification is required"
          } ]
        } ]
      }, {
        "id" : 194,
        "name" : "Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 370,
          "name" : "Close Browser UnMap And Delete Directories",
          "steps" : [ {
            "id" : 1755,
            "name" : "Login information"
          }, {
            "id" : 1752,
            "name" : "Un Map and Delete The Directory"
          }, {
            "id" : 1652,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 73,
      "name" : "03_DWS (Desktop Shopping and Checkout Chrome FR)",
      "functionalities" : [ {
        "id" : 441,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 840,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 3751,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 3752,
            "name" : "Login Info"
          } ]
        }, {
          "id" : 841,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 3753,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 3754,
            "name" : "Logging of Setting Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 842,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 3755,
            "name" : "Open Browser With Type Of Browser And Selenium Hub"
          }, {
            "id" : 3756,
            "name" : "Log Information"
          } ]
        } ]
      }, {
        "id" : 447,
        "name" : "Set Language French",
        "scenarios" : [ {
          "id" : 848,
          "name" : "Set Language French",
          "steps" : [ {
            "id" : 3796,
            "name" : "Set Language FrenchNew"
          }, {
            "id" : 5168,
            "name" : "Set Language French"
          } ]
        } ]
      }, {
        "id" : 602,
        "name" : "Set Language French ORIGINAL",
        "scenarios" : [ {
          "id" : 1119,
          "name" : "Set Language French",
          "steps" : [ {
            "id" : 5046,
            "name" : "Set Language French"
          } ]
        } ]
      }, {
        "id" : 442,
        "name" : "Validate An Anonymous Action",
        "scenarios" : [ {
          "id" : 843,
          "name" : "Validate Favorite",
          "steps" : [ {
            "id" : 3757,
            "name" : "Validate Favorite Header"
          }, {
            "id" : 3758,
            "name" : "Validate Adding an article to Wish list from Department Page"
          }, {
            "id" : 3759,
            "name" : "Validate Adding an article to Wish list from You may also like on Article Page"
          }, {
            "id" : 3760,
            "name" : "Validate Adding an article to Wish list from Search Results Page"
          }, {
            "id" : 3761,
            "name" : "Validate Adding an article to Wish list from Article Page"
          } ]
        } ]
      }, {
        "id" : 443,
        "name" : "Validate Guest User",
        "scenarios" : [ {
          "id" : 844,
          "name" : "Validate Guest User Place Order",
          "steps" : [ {
            "id" : 3762,
            "name" : "Validate messages for order placing"
          }, {
            "id" : 3763,
            "name" : "Validate Guest user uses same address for billing and shipping purposes - IN Validate messages for o"
          }, {
            "id" : 3764,
            "name" : "Validate Guest user uses a different address for billing and shipping purposes"
          }, {
            "id" : 3765,
            "name" : "Validate Guest user edits a shipping address"
          }, {
            "id" : 3766,
            "name" : "Validate Guest user edits a billing address"
          }, {
            "id" : 3767,
            "name" : "Validate Guest user adds a new shipping address - IN PREVIOUS CASES"
          }, {
            "id" : 3768,
            "name" : "Validate Guest user adds a new billing address - IN PREVIOUS CASES"
          } ]
        } ]
      }, {
        "id" : 444,
        "name" : "Validate Registered User",
        "scenarios" : [ {
          "id" : 845,
          "name" : "Validate A Registered Favorite List And Wish List Department",
          "steps" : [ {
            "id" : 3769,
            "name" : "Validate Add Wish List Article"
          }, {
            "id" : 3770,
            "name" : "Validate Share Favorite List"
          }, {
            "id" : 3771,
            "name" : "Validate Delete Wish List Article"
          }, {
            "id" : 3772,
            "name" : "Validate Empty Favorite List"
          }, {
            "id" : 3773,
            "name" : "Validate Account Side Menu Francais"
          }, {
            "id" : 3774,
            "name" : "Validate Item Out Of Stock"
          }, {
            "id" : 3775,
            "name" : "Validate Wish List"
          }, {
            "id" : 3776,
            "name" : "Validate Minimum Order (150$ - QA) - NOT VALID IN STAGE"
          }, {
            "id" : 3777,
            "name" : "Validate Modify Case Quantity"
          }, {
            "id" : 3778,
            "name" : "Validate Checkout"
          }, {
            "id" : 3779,
            "name" : "Validate Add New Address for Checkout"
          } ]
        } ]
      }, {
        "id" : 445,
        "name" : "Validate AVS Response codes",
        "scenarios" : [ {
          "id" : 846,
          "name" : "AVS test Declined Cards",
          "steps" : [ {
            "id" : 3780,
            "name" : "Login"
          }, {
            "id" : 3781,
            "name" : "Go to Order Now page and fill in partial card information"
          }, {
            "id" : 3782,
            "name" : "4761739012345611 G International Card Detected"
          }, {
            "id" : 3783,
            "name" : "4761739012345629 I Address Verification Error The billing address was not verified with the card i"
          }, {
            "id" : 3784,
            "name" : "4761739012345645 N Address Verification Error The billing address and postal code do not match"
          }, {
            "id" : 3785,
            "name" : "4761739012345660 R Address Verification Error The billing address was not verified with the card iss"
          }, {
            "id" : 3786,
            "name" : "4761739012345694 C Address Verification Error Please ensure the billing address is correct or contac"
          }, {
            "id" : 3787,
            "name" : "4761739012345652 P Address Verification Error Please ensure the billing address is correct o"
          }, {
            "id" : 3788,
            "name" : "4761739012345728 Z Address Verification Error Please ensure the billing address is correct o"
          }, {
            "id" : 3789,
            "name" : "4761739012345678 A Address Verification Error Please ensure the billing postal code is correct or co"
          }, {
            "id" : 3790,
            "name" : "4761739012345686 B Address Verification Error Please ensure the billing postal code is corre"
          }, {
            "id" : 3791,
            "name" : "4761739012345751 S Address Verification Error Billing address verification is required"
          }, {
            "id" : 3792,
            "name" : "4761739012345744 U Address Verification Error Billing address verification is required"
          } ]
        } ]
      }, {
        "id" : 446,
        "name" : "Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 847,
          "name" : "Close Browser UnMap And Delete Directories",
          "steps" : [ {
            "id" : 3793,
            "name" : "Login information"
          }, {
            "id" : 3794,
            "name" : "Un Map and Delete The Directory"
          }, {
            "id" : 3795,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 89,
      "name" : "03_DWS (Desktop Shopping and Checkout FIREFOX FR)",
      "functionalities" : [ {
        "id" : 553,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 1034,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 4731,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 4732,
            "name" : "Login Info"
          } ]
        }, {
          "id" : 1035,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 4733,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 4734,
            "name" : "Logging of Setting Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 1036,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 4735,
            "name" : "Open Browser With Type Of Browser And Selenium Hub"
          }, {
            "id" : 4736,
            "name" : "Log Information"
          } ]
        } ]
      }, {
        "id" : 559,
        "name" : "Set Language French",
        "scenarios" : [ {
          "id" : 1042,
          "name" : "Set Language French",
          "steps" : [ {
            "id" : 4776,
            "name" : "Set Language French"
          } ]
        } ]
      }, {
        "id" : 554,
        "name" : "Validate An Anonymous Action",
        "scenarios" : [ {
          "id" : 1037,
          "name" : "Validate Favorite",
          "steps" : [ {
            "id" : 4737,
            "name" : "Validate Favorite Header"
          }, {
            "id" : 4738,
            "name" : "Validate Adding an article to Wish list from Department Page"
          }, {
            "id" : 4739,
            "name" : "Validate Adding an article to Wish list from You may also like on Article Page"
          }, {
            "id" : 4740,
            "name" : "Validate Adding an article to Wish list from Search Results Page"
          }, {
            "id" : 4741,
            "name" : "Validate Adding an article to Wish list from Article Page"
          } ]
        } ]
      }, {
        "id" : 555,
        "name" : "Validate Guest User",
        "scenarios" : [ {
          "id" : 1038,
          "name" : "Validate Guest User Place Order",
          "steps" : [ {
            "id" : 4742,
            "name" : "Validate messages for order placing"
          }, {
            "id" : 4743,
            "name" : "Validate Guest user uses same address for billing and shipping purposes - IN Validate messages for o"
          }, {
            "id" : 4744,
            "name" : "Validate Guest user uses a different address for billing and shipping purposes"
          }, {
            "id" : 4745,
            "name" : "Validate Guest user edits a shipping address"
          }, {
            "id" : 4746,
            "name" : "Validate Guest user edits a billing address"
          }, {
            "id" : 4747,
            "name" : "Validate Guest user adds a new shipping address - IN PREVIOUS CASES"
          }, {
            "id" : 4748,
            "name" : "Validate Guest user adds a new billing address - IN PREVIOUS CASES"
          } ]
        } ]
      }, {
        "id" : 556,
        "name" : "Validate Registered User",
        "scenarios" : [ {
          "id" : 1039,
          "name" : "Validate A Registered Favorite List And Wish List Department",
          "steps" : [ {
            "id" : 4749,
            "name" : "Validate Add Wish List Article"
          }, {
            "id" : 4750,
            "name" : "Validate Share Favorite List"
          }, {
            "id" : 4751,
            "name" : "Validate Delete Wish List Article"
          }, {
            "id" : 4752,
            "name" : "Validate Empty Favorite List"
          }, {
            "id" : 4753,
            "name" : "Validate Account Side Menu Francais"
          }, {
            "id" : 4754,
            "name" : "Validate Item Out Of Stock"
          }, {
            "id" : 4755,
            "name" : "Validate Wish List"
          }, {
            "id" : 4756,
            "name" : "Validate Minimum Order (150$ - QA) - NOT VALID IN STAGE"
          }, {
            "id" : 4757,
            "name" : "Validate Modify Case Quantity"
          }, {
            "id" : 4758,
            "name" : "Validate Checkout"
          }, {
            "id" : 4759,
            "name" : "Validate Add New Address for Checkout"
          } ]
        } ]
      }, {
        "id" : 557,
        "name" : "Validate AVS Response codes",
        "scenarios" : [ {
          "id" : 1040,
          "name" : "AVS test Declined Cards",
          "steps" : [ {
            "id" : 4760,
            "name" : "Login"
          }, {
            "id" : 4761,
            "name" : "Go to Order Now page and fill in partial card information"
          }, {
            "id" : 4762,
            "name" : "4761739012345611 G International Card Detected"
          }, {
            "id" : 4763,
            "name" : "4761739012345629 I Address Verification Error The billing address was not verified with the card i"
          }, {
            "id" : 4764,
            "name" : "4761739012345645 N Address Verification Error The billing address and postal code do not match"
          }, {
            "id" : 4765,
            "name" : "4761739012345660 R Address Verification Error The billing address was not verified with the card iss"
          }, {
            "id" : 4766,
            "name" : "4761739012345694 C Address Verification Error Please ensure the billing address is correct or contac"
          }, {
            "id" : 4767,
            "name" : "4761739012345652 P Address Verification Error Please ensure the billing address is correct o"
          }, {
            "id" : 4768,
            "name" : "4761739012345728 Z Address Verification Error Please ensure the billing address is correct o"
          }, {
            "id" : 4769,
            "name" : "4761739012345678 A Address Verification Error Please ensure the billing postal code is correct or co"
          }, {
            "id" : 4770,
            "name" : "4761739012345686 B Address Verification Error Please ensure the billing postal code is corre"
          }, {
            "id" : 4771,
            "name" : "4761739012345751 S Address Verification Error Billing address verification is required"
          }, {
            "id" : 4772,
            "name" : "4761739012345744 U Address Verification Error Billing address verification is required"
          } ]
        } ]
      }, {
        "id" : 558,
        "name" : "Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 1041,
          "name" : "Close Browser UnMap And Delete Directories",
          "steps" : [ {
            "id" : 4773,
            "name" : "Login information"
          }, {
            "id" : 4774,
            "name" : "Un Map and Delete The Directory"
          }, {
            "id" : 4775,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 80,
      "name" : "03_DWS (Desktop Shopping and Checkout IE EN)",
      "functionalities" : [ {
        "id" : 494,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 937,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 4238,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 4239,
            "name" : "Login Info"
          } ]
        }, {
          "id" : 938,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 4240,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 4241,
            "name" : "Logging of Setting Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 939,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 4242,
            "name" : "Open Browser With Type Of Browser And Selenium Hub"
          }, {
            "id" : 4243,
            "name" : "Log Information"
          } ]
        } ]
      }, {
        "id" : 495,
        "name" : "Validate An Anonymous Action",
        "scenarios" : [ {
          "id" : 940,
          "name" : "Validate Favorite",
          "steps" : [ {
            "id" : 4244,
            "name" : "Validate Favorite Header"
          }, {
            "id" : 4245,
            "name" : "Validate Adding an article to Wish list from Department Page"
          }, {
            "id" : 4246,
            "name" : "Validate Adding an article to Wish list from You may also like on Article Page"
          }, {
            "id" : 4247,
            "name" : "Validate Adding an article to Wish list from Search Results Page"
          }, {
            "id" : 4248,
            "name" : "Validate Adding an article to Wish list from Article Page"
          } ]
        } ]
      }, {
        "id" : 496,
        "name" : "Validate Guest User",
        "scenarios" : [ {
          "id" : 941,
          "name" : "Validate Guest User Place Order",
          "steps" : [ {
            "id" : 4249,
            "name" : "Validate messages for order placing"
          }, {
            "id" : 4250,
            "name" : "Validate Guest user uses same address for billing and shipping purposes - IN Validate messages for o"
          }, {
            "id" : 4251,
            "name" : "Validate Guest user uses a different address for billing and shipping purposes"
          }, {
            "id" : 4252,
            "name" : "Validate Guest user edits a shipping address"
          }, {
            "id" : 4253,
            "name" : "Validate Guest user edits a billing address"
          }, {
            "id" : 4254,
            "name" : "Validate Guest user adds a new shipping address - IN PREVIOUS CASES"
          }, {
            "id" : 4255,
            "name" : "Validate Guest user adds a new billing address - IN PREVIOUS CASES"
          } ]
        } ]
      }, {
        "id" : 497,
        "name" : "Validate Registered User",
        "scenarios" : [ {
          "id" : 942,
          "name" : "Validate A Registered Favorite List And Wish List Department",
          "steps" : [ {
            "id" : 4256,
            "name" : "Validate Add Wish List Article"
          }, {
            "id" : 4257,
            "name" : "Validate Share Favorite List"
          }, {
            "id" : 4258,
            "name" : "Validate Delete Wish List Article"
          }, {
            "id" : 4259,
            "name" : "Validate Empty Favorite List"
          }, {
            "id" : 4260,
            "name" : "Validate Account Side Menu Anglais"
          }, {
            "id" : 4261,
            "name" : "Validate Item Out Of Stock"
          }, {
            "id" : 4262,
            "name" : "Validate Wish List"
          }, {
            "id" : 4263,
            "name" : "Validate Minimum Order (150$ - QA) - NOT VALID IN STAGE"
          }, {
            "id" : 4264,
            "name" : "Validate Modify Case Quantity"
          }, {
            "id" : 4265,
            "name" : "Validate Checkout"
          }, {
            "id" : 4266,
            "name" : "Validate Add New Address for Checkout"
          } ]
        } ]
      }, {
        "id" : 498,
        "name" : "Validate AVS Response codes",
        "scenarios" : [ {
          "id" : 943,
          "name" : "AVS test Declined Cards",
          "steps" : [ {
            "id" : 4267,
            "name" : "Login"
          }, {
            "id" : 4268,
            "name" : "Go to Order Now page and fill in partial card information"
          }, {
            "id" : 4269,
            "name" : "4761739012345611 G International Card Detected"
          }, {
            "id" : 4270,
            "name" : "4761739012345629 I Address Verification Error The billing address was not verified with the card i"
          }, {
            "id" : 4271,
            "name" : "4761739012345645 N Address Verification Error The billing address and postal code do not match"
          }, {
            "id" : 4272,
            "name" : "4761739012345660 R Address Verification Error The billing address was not verified with the card iss"
          }, {
            "id" : 4273,
            "name" : "4761739012345694 C Address Verification Error Please ensure the billing address is correct or contac"
          }, {
            "id" : 4274,
            "name" : "4761739012345652 P Address Verification Error Please ensure the billing address is correct o"
          }, {
            "id" : 4275,
            "name" : "4761739012345728 Z Address Verification Error Please ensure the billing address is correct o"
          }, {
            "id" : 4276,
            "name" : "4761739012345678 A Address Verification Error Please ensure the billing postal code is correct or co"
          }, {
            "id" : 4277,
            "name" : "4761739012345686 B Address Verification Error Please ensure the billing postal code is corre"
          }, {
            "id" : 4278,
            "name" : "4761739012345751 S Address Verification Error Billing address verification is required"
          }, {
            "id" : 4279,
            "name" : "4761739012345744 U Address Verification Error Billing address verification is required"
          } ]
        } ]
      }, {
        "id" : 499,
        "name" : "Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 944,
          "name" : "Close Browser UnMap And Delete Directories",
          "steps" : [ {
            "id" : 4280,
            "name" : "Login information"
          }, {
            "id" : 4281,
            "name" : "Un Map and Delete The Directory"
          }, {
            "id" : 4282,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 83,
      "name" : "03_DWS (Desktop Shopping and Checkout IE FR)",
      "functionalities" : [ {
        "id" : 516,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 977,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 4447,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 4448,
            "name" : "Login Info"
          } ]
        }, {
          "id" : 978,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 4449,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 4450,
            "name" : "Logging of Setting Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 979,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 4451,
            "name" : "Open Browser With Type Of Browser And Selenium Hub"
          }, {
            "id" : 4452,
            "name" : "Log Information"
          } ]
        } ]
      }, {
        "id" : 540,
        "name" : "Set Language French OLD",
        "scenarios" : [ {
          "id" : 1017,
          "name" : "Set Language French",
          "steps" : [ {
            "id" : 4637,
            "name" : "Set Language French"
          } ]
        } ]
      }, {
        "id" : 517,
        "name" : "Validate An Anonymous Action",
        "scenarios" : [ {
          "id" : 980,
          "name" : "Validate Favorite",
          "steps" : [ {
            "id" : 4453,
            "name" : "Validate Favorite Header"
          }, {
            "id" : 4454,
            "name" : "Validate Adding an article to Wish list from Department Page"
          }, {
            "id" : 4455,
            "name" : "Validate Adding an article to Wish list from You may also like on Article Page"
          }, {
            "id" : 4456,
            "name" : "Validate Adding an article to Wish list from Search Results Page"
          }, {
            "id" : 4457,
            "name" : "Validate Adding an article to Wish list from Article Page"
          } ]
        } ]
      }, {
        "id" : 518,
        "name" : "Validate Guest User",
        "scenarios" : [ {
          "id" : 981,
          "name" : "Validate Guest User Place Order",
          "steps" : [ {
            "id" : 4458,
            "name" : "Validate messages for order placing"
          }, {
            "id" : 4459,
            "name" : "Validate Guest user uses same address for billing and shipping purposes - IN Validate messages for o"
          }, {
            "id" : 4460,
            "name" : "Validate Guest user uses a different address for billing and shipping purposes"
          }, {
            "id" : 4461,
            "name" : "Validate Guest user edits a shipping address"
          }, {
            "id" : 4462,
            "name" : "Validate Guest user edits a billing address"
          }, {
            "id" : 4463,
            "name" : "Validate Guest user adds a new shipping address - IN PREVIOUS CASES"
          }, {
            "id" : 4464,
            "name" : "Validate Guest user adds a new billing address - IN PREVIOUS CASES"
          } ]
        } ]
      }, {
        "id" : 519,
        "name" : "Validate Registered User",
        "scenarios" : [ {
          "id" : 982,
          "name" : "Validate A Registered Favorite List And Wish List Department",
          "steps" : [ {
            "id" : 4465,
            "name" : "Validate Add Wish List Article"
          }, {
            "id" : 4466,
            "name" : "Validate Share Favorite List"
          }, {
            "id" : 4467,
            "name" : "Validate Delete Wish List Article"
          }, {
            "id" : 4468,
            "name" : "Validate Empty Favorite List"
          }, {
            "id" : 4469,
            "name" : "Validate Account Side Menu Francais"
          }, {
            "id" : 4470,
            "name" : "Validate Item Out Of Stock"
          }, {
            "id" : 4471,
            "name" : "Validate Wish List"
          }, {
            "id" : 4472,
            "name" : "Validate Minimum Order (150$ - QA) - NOT VALID IN STAGE"
          }, {
            "id" : 4473,
            "name" : "Validate Modify Case Quantity"
          }, {
            "id" : 4474,
            "name" : "Validate Checkout"
          }, {
            "id" : 4475,
            "name" : "Validate Add New Address for Checkout"
          } ]
        } ]
      }, {
        "id" : 520,
        "name" : "Validate AVS Response codes",
        "scenarios" : [ {
          "id" : 983,
          "name" : "AVS test Declined Cards",
          "steps" : [ {
            "id" : 4476,
            "name" : "Login"
          }, {
            "id" : 4477,
            "name" : "Go to Order Now page and fill in partial card information"
          }, {
            "id" : 4478,
            "name" : "4761739012345611 G International Card Detected"
          }, {
            "id" : 4479,
            "name" : "4761739012345629 I Address Verification Error The billing address was not verified with the card i"
          }, {
            "id" : 4480,
            "name" : "4761739012345645 N Address Verification Error The billing address and postal code do not match"
          }, {
            "id" : 4481,
            "name" : "4761739012345660 R Address Verification Error The billing address was not verified with the card iss"
          }, {
            "id" : 4482,
            "name" : "4761739012345694 C Address Verification Error Please ensure the billing address is correct or contac"
          }, {
            "id" : 4483,
            "name" : "4761739012345652 P Address Verification Error Please ensure the billing address is correct o"
          }, {
            "id" : 4484,
            "name" : "4761739012345728 Z Address Verification Error Please ensure the billing address is correct o"
          }, {
            "id" : 4485,
            "name" : "4761739012345678 A Address Verification Error Please ensure the billing postal code is correct or co"
          }, {
            "id" : 4486,
            "name" : "4761739012345686 B Address Verification Error Please ensure the billing postal code is corre"
          }, {
            "id" : 4487,
            "name" : "4761739012345751 S Address Verification Error Billing address verification is required"
          }, {
            "id" : 4488,
            "name" : "4761739012345744 U Address Verification Error Billing address verification is required"
          } ]
        } ]
      }, {
        "id" : 521,
        "name" : "Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 984,
          "name" : "Close Browser UnMap And Delete Directories",
          "steps" : [ {
            "id" : 4489,
            "name" : "Login information"
          }, {
            "id" : 4490,
            "name" : "Un Map and Delete The Directory"
          }, {
            "id" : 4491,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 87,
      "name" : "03_DWS (Desktop Shopping and Checkout Safari EN)",
      "functionalities" : [ {
        "id" : 541,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 1018,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 4639,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 4640,
            "name" : "Login Info"
          } ]
        }, {
          "id" : 1019,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 4641,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 4642,
            "name" : "Logging of Setting Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 1020,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 4643,
            "name" : "Open Browser With Type Of Browser And Selenium Hub"
          }, {
            "id" : 4644,
            "name" : "Log Information"
          } ]
        } ]
      }, {
        "id" : 542,
        "name" : "Validate An Anonymous Action",
        "scenarios" : [ {
          "id" : 1021,
          "name" : "Validate Favorite",
          "steps" : [ {
            "id" : 4645,
            "name" : "Validate Favorite Header"
          }, {
            "id" : 4646,
            "name" : "Validate Adding an article to Wish list from Department Page"
          }, {
            "id" : 4647,
            "name" : "Validate Adding an article to Wish list from You may also like on Article Page"
          }, {
            "id" : 4648,
            "name" : "Validate Adding an article to Wish list from Search Results Page"
          }, {
            "id" : 4649,
            "name" : "Validate Adding an article to Wish list from Article Page"
          } ]
        } ]
      }, {
        "id" : 543,
        "name" : "Validate Guest User",
        "scenarios" : [ {
          "id" : 1022,
          "name" : "Validate Guest User Place Order",
          "steps" : [ {
            "id" : 4650,
            "name" : "Validate messages for order placing"
          }, {
            "id" : 4651,
            "name" : "Validate Guest user uses same address for billing and shipping purposes - IN Validate messages for o"
          }, {
            "id" : 4652,
            "name" : "Validate Guest user uses a different address for billing and shipping purposes"
          }, {
            "id" : 4653,
            "name" : "Validate Guest user edits a shipping address"
          }, {
            "id" : 4654,
            "name" : "Validate Guest user edits a billing address"
          }, {
            "id" : 4655,
            "name" : "Validate Guest user adds a new shipping address - IN PREVIOUS CASES"
          }, {
            "id" : 4656,
            "name" : "Validate Guest user adds a new billing address - IN PREVIOUS CASES"
          } ]
        } ]
      }, {
        "id" : 544,
        "name" : "Validate Registered User",
        "scenarios" : [ {
          "id" : 1023,
          "name" : "Validate A Registered Favorite List And Wish List Department",
          "steps" : [ {
            "id" : 4657,
            "name" : "Validate Add Wish List Article"
          }, {
            "id" : 4658,
            "name" : "Validate Share Favorite List"
          }, {
            "id" : 4659,
            "name" : "Validate Delete Wish List Article"
          }, {
            "id" : 4660,
            "name" : "Validate Empty Favorite List"
          }, {
            "id" : 4661,
            "name" : "Validate Account Side Menu Anglais - New inQA My Information"
          }, {
            "id" : 4662,
            "name" : "Validate Item Out Of Stock"
          }, {
            "id" : 4663,
            "name" : "Validate Wish List"
          }, {
            "id" : 4664,
            "name" : "Validate Minimum Order (150$ - QA) - NOT VALID IN STAGE"
          }, {
            "id" : 4665,
            "name" : "Validate Modify Case Quantity"
          }, {
            "id" : 4666,
            "name" : "Validate Checkout"
          }, {
            "id" : 4667,
            "name" : "Validate Add New Address for Checkout"
          } ]
        } ]
      }, {
        "id" : 545,
        "name" : "Validate AVS Response codes",
        "scenarios" : [ {
          "id" : 1024,
          "name" : "AVS test Declined Cards",
          "steps" : [ {
            "id" : 4668,
            "name" : "Login"
          }, {
            "id" : 4669,
            "name" : "Go to Order Now page and fill in partial card information"
          }, {
            "id" : 4670,
            "name" : "4761739012345611 G International Card Detected"
          }, {
            "id" : 4671,
            "name" : "4761739012345629 I Address Verification Error The billing address was not verified with the card i"
          }, {
            "id" : 4672,
            "name" : "4761739012345645 N Address Verification Error The billing address and postal code do not match"
          }, {
            "id" : 4673,
            "name" : "4761739012345660 R Address Verification Error The billing address was not verified with the card iss"
          }, {
            "id" : 4674,
            "name" : "4761739012345694 C Address Verification Error Please ensure the billing address is correct or contac"
          }, {
            "id" : 4675,
            "name" : "4761739012345652 P Address Verification Error Please ensure the billing address is correct o"
          }, {
            "id" : 4676,
            "name" : "4761739012345728 Z Address Verification Error Please ensure the billing address is correct o"
          }, {
            "id" : 4677,
            "name" : "4761739012345678 A Address Verification Error Please ensure the billing postal code is correct or co"
          }, {
            "id" : 4678,
            "name" : "4761739012345686 B Address Verification Error Please ensure the billing postal code is corre"
          }, {
            "id" : 4679,
            "name" : "4761739012345751 S Address Verification Error Billing address verification is required"
          }, {
            "id" : 4680,
            "name" : "4761739012345744 U Address Verification Error Billing address verification is required"
          } ]
        } ]
      }, {
        "id" : 546,
        "name" : "Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 1025,
          "name" : "Close Browser UnMap And Delete Directories",
          "steps" : [ {
            "id" : 4681,
            "name" : "Login information"
          }, {
            "id" : 4682,
            "name" : "Un Map and Delete The Directory"
          }, {
            "id" : 4683,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 100,
      "name" : "03_DWS (Desktop Shopping and Checkout Safari FR)",
      "functionalities" : [ {
        "id" : 611,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 1136,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 5123,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 5124,
            "name" : "Login Info"
          } ]
        }, {
          "id" : 1137,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 5125,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 5126,
            "name" : "Logging of Setting Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 1138,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 5127,
            "name" : "Open Browser With Type Of Browser And Selenium Hub"
          }, {
            "id" : 5128,
            "name" : "Log Information"
          } ]
        } ]
      }, {
        "id" : 612,
        "name" : "Validate An Anonymous Action",
        "scenarios" : [ {
          "id" : 1139,
          "name" : "Validate Favorite",
          "steps" : [ {
            "id" : 5129,
            "name" : "Validate Favorite Header"
          }, {
            "id" : 5130,
            "name" : "Validate Adding an article to Wish list from Department Page"
          }, {
            "id" : 5131,
            "name" : "Validate Adding an article to Wish list from You may also like on Article Page"
          }, {
            "id" : 5132,
            "name" : "Validate Adding an article to Wish list from Search Results Page"
          }, {
            "id" : 5133,
            "name" : "Validate Adding an article to Wish list from Article Page"
          } ]
        } ]
      }, {
        "id" : 613,
        "name" : "Validate Guest User",
        "scenarios" : [ {
          "id" : 1140,
          "name" : "Validate Guest User Place Order",
          "steps" : [ {
            "id" : 5134,
            "name" : "Validate messages for order placing"
          }, {
            "id" : 5135,
            "name" : "Validate Guest user uses same address for billing and shipping purposes - IN Validate messages for o"
          }, {
            "id" : 5136,
            "name" : "Validate Guest user uses a different address for billing and shipping purposes"
          }, {
            "id" : 5137,
            "name" : "Validate Guest user edits a shipping address"
          }, {
            "id" : 5138,
            "name" : "Validate Guest user edits a billing address"
          }, {
            "id" : 5139,
            "name" : "Validate Guest user adds a new shipping address - IN PREVIOUS CASES"
          }, {
            "id" : 5140,
            "name" : "Validate Guest user adds a new billing address - IN PREVIOUS CASES"
          } ]
        } ]
      }, {
        "id" : 614,
        "name" : "Validate Registered User",
        "scenarios" : [ {
          "id" : 1141,
          "name" : "Validate A Registered Favorite List And Wish List Department",
          "steps" : [ {
            "id" : 5141,
            "name" : "Validate Add Wish List Article"
          }, {
            "id" : 5142,
            "name" : "Validate Share Favorite List"
          }, {
            "id" : 5143,
            "name" : "Validate Delete Wish List Article"
          }, {
            "id" : 5144,
            "name" : "Validate Empty Favorite List"
          }, {
            "id" : 5145,
            "name" : "Validate Account Side Menu Anglais - New inQA My Information"
          }, {
            "id" : 5146,
            "name" : "Validate Item Out Of Stock"
          }, {
            "id" : 5147,
            "name" : "Validate Wish List"
          }, {
            "id" : 5148,
            "name" : "Validate Minimum Order (150$ - QA) - NOT VALID IN STAGE"
          }, {
            "id" : 5149,
            "name" : "Validate Modify Case Quantity"
          }, {
            "id" : 5150,
            "name" : "Validate Checkout"
          }, {
            "id" : 5151,
            "name" : "Validate Add New Address for Checkout"
          } ]
        } ]
      }, {
        "id" : 615,
        "name" : "Validate AVS Response codes",
        "scenarios" : [ {
          "id" : 1142,
          "name" : "AVS test Declined Cards",
          "steps" : [ {
            "id" : 5152,
            "name" : "Login"
          }, {
            "id" : 5153,
            "name" : "Go to Order Now page and fill in partial card information"
          }, {
            "id" : 5154,
            "name" : "4761739012345611 G International Card Detected"
          }, {
            "id" : 5155,
            "name" : "4761739012345629 I Address Verification Error The billing address was not verified with the card i"
          }, {
            "id" : 5156,
            "name" : "4761739012345645 N Address Verification Error The billing address and postal code do not match"
          }, {
            "id" : 5157,
            "name" : "4761739012345660 R Address Verification Error The billing address was not verified with the card iss"
          }, {
            "id" : 5158,
            "name" : "4761739012345694 C Address Verification Error Please ensure the billing address is correct or contac"
          }, {
            "id" : 5159,
            "name" : "4761739012345652 P Address Verification Error Please ensure the billing address is correct o"
          }, {
            "id" : 5160,
            "name" : "4761739012345728 Z Address Verification Error Please ensure the billing address is correct o"
          }, {
            "id" : 5161,
            "name" : "4761739012345678 A Address Verification Error Please ensure the billing postal code is correct or co"
          }, {
            "id" : 5162,
            "name" : "4761739012345686 B Address Verification Error Please ensure the billing postal code is corre"
          }, {
            "id" : 5163,
            "name" : "4761739012345751 S Address Verification Error Billing address verification is required"
          }, {
            "id" : 5164,
            "name" : "4761739012345744 U Address Verification Error Billing address verification is required"
          } ]
        } ]
      }, {
        "id" : 616,
        "name" : "Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 1143,
          "name" : "Close Browser UnMap And Delete Directories",
          "steps" : [ {
            "id" : 5165,
            "name" : "Login information"
          }, {
            "id" : 5166,
            "name" : "Un Map and Delete The Directory"
          }, {
            "id" : 5167,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 109,
      "name" : "Test Yves 02-Mobile Tablette (Android Product Catalog Chrome EN)",
      "functionalities" : [ {
        "id" : 669,
        "name" : "01_Setting Of Selenium, Browser And Variables",
        "scenarios" : [ {
          "id" : 1234,
          "name" : "01_Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 5585,
            "name" : "01_Setting Variables (Data Repository)"
          }, {
            "id" : 5586,
            "name" : "02_Log for Data Repository"
          } ]
        }, {
          "id" : 1235,
          "name" : "03_Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 5587,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub Physique"
          }, {
            "id" : 5588,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub Simulator"
          }, {
            "id" : 5589,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub Simulator MacDev1"
          }, {
            "id" : 5590,
            "name" : "02_Log When Browser is opened"
          } ]
        } ]
      }, {
        "id" : 670,
        "name" : "02_Set Language English",
        "scenarios" : [ {
          "id" : 1236,
          "name" : "01_Set Language English",
          "steps" : [ {
            "id" : 5591,
            "name" : "01_Set Language English"
          } ]
        } ]
      }, {
        "id" : 671,
        "name" : "03_Validate Content validation and Browse articles from home page",
        "scenarios" : [ {
          "id" : 1237,
          "name" : "01_Validate Home Page",
          "steps" : [ {
            "id" : 5592,
            "name" : "01_Validate Sticky header"
          }, {
            "id" : 5593,
            "name" : "02_Validate Start shopping Button on Banner and the Shop now"
          } ]
        }, {
          "id" : 1238,
          "name" : "02_Validate Header",
          "steps" : [ {
            "id" : 5594,
            "name" : "01_Validate Top Middle - Header"
          }, {
            "id" : 5595,
            "name" : "02_Validate Low - Header"
          } ]
        } ]
      }, {
        "id" : 672,
        "name" : "04_Validate Shop By Activity and Department - menu & sub-menu items",
        "scenarios" : [ {
          "id" : 1239,
          "name" : "01_Validate All menu and sub-menu for Departments",
          "steps" : [ {
            "id" : 5596,
            "name" : "Validate Sub-menu for Cleaning"
          }, {
            "id" : 5597,
            "name" : "Validate Sub-menu for Clothing"
          }, {
            "id" : 5598,
            "name" : "Validate Sub-menu for Electronics"
          }, {
            "id" : 5599,
            "name" : "Validate Sub-menu for Food"
          }, {
            "id" : 5600,
            "name" : "Validate Sub-menu for Hardware"
          }, {
            "id" : 5601,
            "name" : "Validate Sub-menu for Health & Beauty"
          }, {
            "id" : 5602,
            "name" : "Validate Sub-menu for Home Decor"
          }, {
            "id" : 5603,
            "name" : "Validate Sub-menu for Kitchen"
          }, {
            "id" : 5604,
            "name" : "Validate Sub-menu for Office"
          }, {
            "id" : 5605,
            "name" : "Validate Sub-menu for Party"
          }, {
            "id" : 5606,
            "name" : "Validate Sub-menu for Pets"
          }, {
            "id" : 5607,
            "name" : "Validate Sub-menu for Toys"
          } ]
        }, {
          "id" : 1240,
          "name" : "02_Validate All Menu and sub-menu Activity",
          "steps" : [ {
            "id" : 5608,
            "name" : "Validate menu roll down for Activity"
          }, {
            "id" : 5609,
            "name" : "Validate menu for shop by Activity"
          }, {
            "id" : 5610,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels"
          }, {
            "id" : 5611,
            "name" : "Validate Sub-menu Event, Party & Wedding Planning"
          }, {
            "id" : 5612,
            "name" : "Validate Sub-menu Hospital & Care Facilities"
          }, {
            "id" : 5613,
            "name" : "Validate Sub-menu Maintenance"
          }, {
            "id" : 5614,
            "name" : "Validate Sub-menu Offices"
          }, {
            "id" : 5615,
            "name" : "Validate Sub-menu Schools"
          } ]
        } ]
      }, {
        "id" : 673,
        "name" : "05_Validate Filter",
        "scenarios" : [ {
          "id" : 1241,
          "name" : "01_Validate Filter Department",
          "steps" : [ {
            "id" : 5616,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 5617,
            "name" : "02_Validate Filter By Departments"
          }, {
            "id" : 5618,
            "name" : "03_Validate Filter by Business"
          }, {
            "id" : 5619,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 5620,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 5621,
            "name" : "05_Validate Many Filter Same time"
          } ]
        }, {
          "id" : 1242,
          "name" : "02_Validate Filter Activity",
          "steps" : [ {
            "id" : 5622,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 5623,
            "name" : "02_Validate Filter By Departments"
          }, {
            "id" : 5624,
            "name" : "03_Validate Filter by Business"
          }, {
            "id" : 5625,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 5626,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 5627,
            "name" : "05_Validate Many Filter Same time"
          } ]
        }, {
          "id" : 1243,
          "name" : "02_Validate Filter ActivityOLD",
          "steps" : [ {
            "id" : 5628,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 5629,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 5630,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 5631,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 5632,
            "name" : "05_Validate Many Filters Same time"
          } ]
        } ]
      }, {
        "id" : 674,
        "name" : "06_Validate Short",
        "scenarios" : [ {
          "id" : 1244,
          "name" : "01_Validate Short Department",
          "steps" : [ {
            "id" : 5633,
            "name" : "01_Validate Price per case Low to High"
          }, {
            "id" : 5634,
            "name" : "02_Validate Price per case High to Low"
          }, {
            "id" : 5635,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 5636,
            "name" : "04_Validate Name Z to A"
          }, {
            "id" : 5637,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 5638,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        }, {
          "id" : 1245,
          "name" : "02_Validate Short Activity",
          "steps" : [ {
            "id" : 5639,
            "name" : "01_Validate price per Case Low to High"
          }, {
            "id" : 5640,
            "name" : "02_Validate price per Case High to Low"
          }, {
            "id" : 5641,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 5642,
            "name" : "04_Validatre Name Z to A"
          }, {
            "id" : 5643,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 5644,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        } ]
      }, {
        "id" : 675,
        "name" : "07_Validate Article Page Content",
        "scenarios" : [ {
          "id" : 1246,
          "name" : "01_Validate Department Article Page",
          "steps" : [ {
            "id" : 5645,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 5646,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 5647,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 5648,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 5649,
            "name" : "05_Validate Article title"
          }, {
            "id" : 5650,
            "name" : "06_Validate You may also like"
          }, {
            "id" : 5651,
            "name" : "Copy of 03_Validate Add Favorite in article page"
          } ]
        }, {
          "id" : 1247,
          "name" : "02_Validate Activity Article Page",
          "steps" : [ {
            "id" : 5652,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 5653,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 5654,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 5655,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 5656,
            "name" : "05_Validate Article title"
          }, {
            "id" : 5657,
            "name" : "06_Validate You may also like"
          } ]
        } ]
      }, {
        "id" : 676,
        "name" : "08_Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 1248,
          "name" : "01_UnMap And Delete Directory",
          "steps" : [ {
            "id" : 5658,
            "name" : "01_Log To UnMap"
          }, {
            "id" : 5659,
            "name" : "02_Un Map and Delete The Directory On Server And Virtual Machine"
          } ]
        }, {
          "id" : 1249,
          "name" : "02_Close browser",
          "steps" : [ {
            "id" : 5660,
            "name" : "01_Logging of the Teardown"
          }, {
            "id" : 5661,
            "name" : "02_Close Application Mobile"
          } ]
        } ]
      } ]
    }, {
      "id" : 114,
      "name" : "01_DWS (Desktop Product Catalog Safari FR)(Houcine)",
      "functionalities" : [ {
        "id" : 701,
        "name" : "01_Setting Of Selenium, Browser And Variables",
        "scenarios" : [ {
          "id" : 1292,
          "name" : "01_Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 5832,
            "name" : "01_Setting Variables (Data Repository)"
          }, {
            "id" : 5833,
            "name" : "02_Log for Data Repository"
          } ]
        }, {
          "id" : 1293,
          "name" : "02_Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 5834,
            "name" : "01_Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 5835,
            "name" : "02_Logging of Setting Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 1294,
          "name" : "03_Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 5836,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub"
          }, {
            "id" : 5837,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub Local PC Amira"
          }, {
            "id" : 5838,
            "name" : "02_Log When Browser is opened"
          } ]
        } ]
      }, {
        "id" : 702,
        "name" : "02_Set Language French",
        "scenarios" : [ {
          "id" : 1295,
          "name" : "01_Set Language French",
          "steps" : [ {
            "id" : 5839,
            "name" : "01_Set Language French"
          } ]
        } ]
      }, {
        "id" : 704,
        "name" : "04_Validate Shop By Activity and Department - menu & sub-menu items",
        "scenarios" : [ {
          "id" : 1298,
          "name" : "01_Validate All menu and sub-menu for Departments",
          "steps" : [ {
            "id" : 5844,
            "name" : "Validate menu for shop by Department"
          }, {
            "id" : 5845,
            "name" : "Validate Sub-menu for Food (Alimentation)"
          }, {
            "id" : 5846,
            "name" : "Validate Sub-menu for Pets (Animaux)"
          }, {
            "id" : 5847,
            "name" : "Validate Sub-menu for Pets (Animaux) - Part 2"
          }, {
            "id" : 5848,
            "name" : "Validate Sub-menu for Party (Célébrations)"
          }, {
            "id" : 5849,
            "name" : "Validate Sub-menu for Party (Célébrations) - Part 2"
          }, {
            "id" : 5850,
            "name" : "Validate Sub-menu for Kitchen (Cuisine)"
          }, {
            "id" : 5851,
            "name" : "Validate Sub-menu for Kitchen (Cuisine) - Part 2"
          }, {
            "id" : 5852,
            "name" : "Validate Sub-menu for Electronics (Électronique)"
          }, {
            "id" : 5853,
            "name" : "Validate Sub-menu for Electronics (Électronique) - Part 2"
          }, {
            "id" : 5854,
            "name" : "Validate Sub-menu for Office (Fournitures de bureau)"
          }, {
            "id" : 5855,
            "name" : "Validate Sub-menu for Office (Fournitures de bureau) - Part 2"
          }, {
            "id" : 5856,
            "name" : "Validate Sub-menu for Toys (Jouets)"
          }, {
            "id" : 5857,
            "name" : "Validate Sub-menu for Home Decor (Maison)"
          }, {
            "id" : 5858,
            "name" : "Validate Sub-menu for Home Decor (Maison) - Part 2"
          }, {
            "id" : 5859,
            "name" : "Validate Sub-menu for Cleaning (Produits ménagers)"
          }, {
            "id" : 5860,
            "name" : "Validate Sub-menu for Cleaning (Produits ménagers) - Part 2"
          }, {
            "id" : 5861,
            "name" : "Validate Sub-menu for Hardware (Quincaillerie)"
          }, {
            "id" : 5862,
            "name" : "Validate Sub-menu for Cleaning (Quincaillerie) - Part 2"
          }, {
            "id" : 5863,
            "name" : "Validate Sub-menu for Health & Beauty (Santé & beauté)"
          }, {
            "id" : 5864,
            "name" : "Validate Sub-menu for Health & Beauty (Santé & Beauté) - Part 2"
          }, {
            "id" : 5865,
            "name" : "Validate Sub-menu for Clothing (Vêtements)"
          } ]
        }, {
          "id" : 1299,
          "name" : "02_Validate All Menu and sub-menu Activity",
          "steps" : [ {
            "id" : 5866,
            "name" : "Validate menu roll down for Activity"
          }, {
            "id" : 5867,
            "name" : "Validate menu for shop by Activity"
          }, {
            "id" : 5868,
            "name" : "Validate Sub-menu Offices (Bureaux)"
          }, {
            "id" : 5869,
            "name" : "Validate Sub-menu Schools (Écoles)"
          }, {
            "id" : 5870,
            "name" : "Validate Sub-menu Maintenance (Entretien général)"
          }, {
            "id" : 5871,
            "name" : "Validate Sub-menu Maintenance (Entretien général) - Part 2"
          }, {
            "id" : 5872,
            "name" : "Validate Sub-menu Event, Party & Wedding Planning (Événements, fêtes et organisation de mariages)"
          }, {
            "id" : 5873,
            "name" : "Validate Sub-menu EPWP (Événements, fêtes et organisation de mariages) - Part 2"
          }, {
            "id" : 5874,
            "name" : "Validate Sub-menu Hospital & Care Facilities (Hôpitaux et établissements de soins)"
          }, {
            "id" : 5875,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels (Traiteurs, restaurants et hôtels)"
          }, {
            "id" : 5876,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels (Traiteurs, restaurants et hôtels) - Part 2"
          } ]
        } ]
      }, {
        "id" : 705,
        "name" : "05_Validate Filter",
        "scenarios" : [ {
          "id" : 1300,
          "name" : "01_Validate Filter Department",
          "steps" : [ {
            "id" : 5877,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 5878,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 5879,
            "name" : "03_Validate Filter by Brand (Marque)"
          }, {
            "id" : 5880,
            "name" : "04_Validate Filter by Unit Price (Prix unitaire)"
          }, {
            "id" : 5881,
            "name" : "05_Validate Many Filter Same time"
          } ]
        }, {
          "id" : 1301,
          "name" : "02_Validate Filter Activity",
          "steps" : [ {
            "id" : 5882,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 5883,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 5884,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 5885,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 5886,
            "name" : "05_Validate Many Filters Same time"
          } ]
        } ]
      }, {
        "id" : 706,
        "name" : "06_Validate Short",
        "scenarios" : [ {
          "id" : 1302,
          "name" : "01_Validate Short Department",
          "steps" : [ {
            "id" : 5887,
            "name" : "01_Validate Price per case Low to High"
          }, {
            "id" : 5888,
            "name" : "02_Validate Price per case High to Low"
          }, {
            "id" : 5889,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 5890,
            "name" : "04_Validatre Name Z to A"
          }, {
            "id" : 5891,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 5892,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        }, {
          "id" : 1303,
          "name" : "02_Validate Short Activity",
          "steps" : [ {
            "id" : 5893,
            "name" : "01_Validate price per Case Low to High"
          }, {
            "id" : 5894,
            "name" : "02_Validate price per Case High to Low"
          }, {
            "id" : 5895,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 5896,
            "name" : "04_Validatre Name Z to A"
          }, {
            "id" : 5897,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 5898,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        } ]
      }, {
        "id" : 707,
        "name" : "07_Validate Article Page Content",
        "scenarios" : [ {
          "id" : 1304,
          "name" : "01_Validate Department Article Page",
          "steps" : [ {
            "id" : 5899,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 5900,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 5901,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 5902,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 5903,
            "name" : "05_Validate Article title"
          }, {
            "id" : 5904,
            "name" : "06_Validate You may also like"
          } ]
        }, {
          "id" : 1305,
          "name" : "02_Validate Activity Article Page",
          "steps" : [ {
            "id" : 5905,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 5906,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 5907,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 5908,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 5909,
            "name" : "05_Validate Article title"
          }, {
            "id" : 5910,
            "name" : "06_Validate You may also like"
          } ]
        } ]
      }, {
        "id" : 703,
        "name" : "03_Validate Content validation and Browse articles from home page",
        "scenarios" : [ {
          "id" : 1296,
          "name" : "01_Validate Home Page",
          "steps" : [ {
            "id" : 5840,
            "name" : "01_Validate Sticky header"
          }, {
            "id" : 5841,
            "name" : "02_Validate Start shopping Button on Banner and the Shop now"
          } ]
        }, {
          "id" : 1297,
          "name" : "02_Validate Header",
          "steps" : [ {
            "id" : 5842,
            "name" : "01_Validate Top Middle - Header"
          }, {
            "id" : 5843,
            "name" : "02_Validate Low - Header"
          } ]
        } ]
      }, {
        "id" : 708,
        "name" : "08_Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 1306,
          "name" : "01_UnMap And Delete Directory",
          "steps" : [ {
            "id" : 5911,
            "name" : "01_Log To UnMap"
          }, {
            "id" : 5912,
            "name" : "02_Un Map and Delete The Directory On Server And Virtual Machine"
          } ]
        }, {
          "id" : 1307,
          "name" : "02_Close browser",
          "steps" : [ {
            "id" : 5913,
            "name" : "01_Logging of the Teardown"
          }, {
            "id" : 5914,
            "name" : "02_Close browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 111,
      "name" : "02-DWS Mobile Phone Android (Account Chrome EN) (HOUCINE)",
      "functionalities" : [ {
        "id" : 685,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 1266,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 5739,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 5740,
            "name" : "Log Setting Variables (Data Repository)"
          } ]
        }, {
          "id" : 1267,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 5741,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 5742,
            "name" : "Log Of Setting Selenium Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 1268,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 5743,
            "name" : "Setting The Opening Of Browser With Selenium Hub houcine"
          }, {
            "id" : 6354,
            "name" : "Setting The Opening Of Browser With Selenium Hub"
          } ]
        } ]
      }, {
        "id" : 686,
        "name" : "Set Language English",
        "scenarios" : [ {
          "id" : 1269,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 5744,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 687,
        "name" : "Copie de Set Language English",
        "scenarios" : [ {
          "id" : 1270,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 5745,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 688,
        "name" : "Validate My Account",
        "scenarios" : [ {
          "id" : 1271,
          "name" : "Validate Login Functions",
          "steps" : [ {
            "id" : 5746,
            "name" : "Validate Login Logout"
          }, {
            "id" : 5747,
            "name" : "Validate Login Forgot Password"
          } ]
        }, {
          "id" : 1272,
          "name" : "Validate User",
          "steps" : [ {
            "id" : 5748,
            "name" : "Validate User Creation"
          }, {
            "id" : 5749,
            "name" : "Validate User Address Creation"
          } ]
        }, {
          "id" : 1273,
          "name" : "Validate Page Account",
          "steps" : [ {
            "id" : 5750,
            "name" : "Validate Create Blank Account"
          }, {
            "id" : 5751,
            "name" : "Validate Create Account With Invalid Data"
          }, {
            "id" : 5752,
            "name" : "Validate User Register Account Invalid Password"
          }, {
            "id" : 5753,
            "name" : "Validate User Register Account Different Password"
          }, {
            "id" : 5754,
            "name" : "Validate Logged User Shopping Cart Remember"
          }, {
            "id" : 5755,
            "name" : "Validate Modify Account And information French"
          }, {
            "id" : 6343,
            "name" : "Validate Modify Account And information English"
          }, {
            "id" : 5757,
            "name" : "Validate information into Login page"
          }, {
            "id" : 5758,
            "name" : "Copie de Validate information into Login page"
          }, {
            "id" : 5759,
            "name" : "Copy of Validate Stay in checkbox Test Yves"
          }, {
            "id" : 5760,
            "name" : "Validate Stay in checkbox"
          }, {
            "id" : 5761,
            "name" : "Validate Forgot password xxx(Inclu dans Validate Login Functions) xxx"
          } ]
        } ]
      }, {
        "id" : 689,
        "name" : "Close Browser",
        "scenarios" : [ {
          "id" : 1274,
          "name" : "Close Browser",
          "steps" : [ {
            "id" : 5762,
            "name" : "Log Of Closing Browser"
          }, {
            "id" : 5763,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 112,
      "name" : "03-DWS Mobile Phone Android (Shopping and Checkout Chrome EN)(Bujor)",
      "functionalities" : [ {
        "id" : 690,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 1275,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 5764,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 5765,
            "name" : "Login Info"
          } ]
        }, {
          "id" : 1276,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 5766,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 5767,
            "name" : "Logging of Setting Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 1277,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 5768,
            "name" : "Open Browser With Type Of Browser And Selenium Hub"
          }, {
            "id" : 5962,
            "name" : "Open Browser With Type Of Browser And Selenium Hub (Bujor)"
          }, {
            "id" : 5769,
            "name" : "Log Information"
          } ]
        } ]
      }, {
        "id" : 691,
        "name" : "Set Language English",
        "scenarios" : [ {
          "id" : 1278,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 5770,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 692,
        "name" : "Validate An Anonymous Action",
        "scenarios" : [ {
          "id" : 1279,
          "name" : "Validate Favorite",
          "steps" : [ {
            "id" : 5771,
            "name" : "Validate Favorite Header"
          }, {
            "id" : 5772,
            "name" : "Validate Adding an article to Wish list from Department Page"
          }, {
            "id" : 5773,
            "name" : "Validate Adding an article to Wish list from You may also like on Article Page"
          }, {
            "id" : 5774,
            "name" : "Validate Adding an article to Wish list from Search Results Page"
          }, {
            "id" : 5775,
            "name" : "Validate Adding an article to Wish list from Article Page"
          } ]
        } ]
      }, {
        "id" : 693,
        "name" : "Validate Guest User",
        "scenarios" : [ {
          "id" : 1280,
          "name" : "Validate Guest User Place Order",
          "steps" : [ {
            "id" : 5776,
            "name" : "Validate messages for order placing"
          }, {
            "id" : 5777,
            "name" : "Validate Guest user uses same address for billing and shipping purposes - IN Validate messages for o"
          }, {
            "id" : 5778,
            "name" : "Validate Guest user uses a different address for billing and shipping purposes"
          }, {
            "id" : 5779,
            "name" : "Validate Guest user edits a shipping address"
          }, {
            "id" : 5780,
            "name" : "Validate Guest user edits a billing address F"
          }, {
            "id" : 5781,
            "name" : "Validate Guest user adds a new shipping address - IN PREVIOUS CASES"
          }, {
            "id" : 5782,
            "name" : "Validate Guest user adds a new billing address - IN PREVIOUS CASES"
          } ]
        } ]
      }, {
        "id" : 694,
        "name" : "Validate Registered User",
        "scenarios" : [ {
          "id" : 1281,
          "name" : "Validate A Registered Favorite List And Wish List Department",
          "steps" : [ {
            "id" : 5783,
            "name" : "Validate Add Wish List Article"
          }, {
            "id" : 5784,
            "name" : "Validate Share Favorite List"
          }, {
            "id" : 5785,
            "name" : "Validate Delete Wish List Article"
          }, {
            "id" : 5786,
            "name" : "Validate Empty Favorite List"
          }, {
            "id" : 5787,
            "name" : "Validate Account Side Menu Anglais"
          }, {
            "id" : 5788,
            "name" : "Validate Item Out Of Stock"
          }, {
            "id" : 5789,
            "name" : "Validate Wish List"
          }, {
            "id" : 5790,
            "name" : "Validate Minimum Order (150$ - QA) - NOT VALID IN STAGE"
          }, {
            "id" : 5791,
            "name" : "Validate Modify Case Quantity"
          }, {
            "id" : 5792,
            "name" : "Validate Checkout"
          }, {
            "id" : 5793,
            "name" : "Validate Add New Address for Checkout"
          } ]
        } ]
      }, {
        "id" : 695,
        "name" : "Validate AVS Response codes",
        "scenarios" : [ {
          "id" : 1282,
          "name" : "AVS test Declined Cards",
          "steps" : [ {
            "id" : 5794,
            "name" : "Login"
          }, {
            "id" : 5795,
            "name" : "Go to Order Now page and fill in partial card information"
          }, {
            "id" : 5796,
            "name" : "4761739012345611 G International Card Detected"
          }, {
            "id" : 5797,
            "name" : "4761739012345629 I Address Verification Error The billing address was not verified with the card i"
          }, {
            "id" : 5798,
            "name" : "4761739012345645 N Address Verification Error The billing address and postal code do not match"
          }, {
            "id" : 5799,
            "name" : "4761739012345660 R Address Verification Error The billing address was not verified with the card iss"
          }, {
            "id" : 5800,
            "name" : "4761739012345694 C Address Verification Error Please ensure the billing address is correct or contac"
          }, {
            "id" : 5801,
            "name" : "4761739012345652 P Address Verification Error Please ensure the billing address is correct o"
          }, {
            "id" : 5802,
            "name" : "4761739012345728 Z Address Verification Error Please ensure the billing address is correct o"
          }, {
            "id" : 5803,
            "name" : "4761739012345678 A Address Verification Error Please ensure the billing postal code is correct or co"
          }, {
            "id" : 5804,
            "name" : "4761739012345686 B Address Verification Error Please ensure the billing postal code is corre"
          }, {
            "id" : 5805,
            "name" : "4761739012345751 S Address Verification Error Billing address verification is required"
          }, {
            "id" : 5806,
            "name" : "4761739012345744 U Address Verification Error Billing address verification is required"
          } ]
        } ]
      }, {
        "id" : 696,
        "name" : "Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 1283,
          "name" : "Close Browser UnMap And Delete Directories",
          "steps" : [ {
            "id" : 5807,
            "name" : "Login information"
          }, {
            "id" : 5808,
            "name" : "Un Map and Delete The Directory"
          }, {
            "id" : 5809,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 117,
      "name" : "Copie de 02-DWS (Desktop My Account Safari EN )(Didier)",
      "functionalities" : [ {
        "id" : 723,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 1327,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 6022,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 6023,
            "name" : "Log Setting Variables (Data Repository)"
          } ]
        }, {
          "id" : 1328,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 6024,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 6025,
            "name" : "Log Of Setting Selenium Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 1329,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 6026,
            "name" : "Setting The Opening Of Browser With Selenium Hub"
          } ]
        } ]
      }, {
        "id" : 724,
        "name" : "Set Language English",
        "scenarios" : [ {
          "id" : 1330,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 6027,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 725,
        "name" : "Validate My Account",
        "scenarios" : [ {
          "id" : 1331,
          "name" : "Validate Login Functions",
          "steps" : [ {
            "id" : 6028,
            "name" : "Validate Login Logout"
          }, {
            "id" : 6029,
            "name" : "Validate Login Forgot Password"
          } ]
        }, {
          "id" : 1332,
          "name" : "Validate User",
          "steps" : [ {
            "id" : 6030,
            "name" : "Validate User Creation"
          }, {
            "id" : 6031,
            "name" : "Validate User Address Creation"
          } ]
        }, {
          "id" : 1333,
          "name" : "Validate Page Account",
          "steps" : [ {
            "id" : 6032,
            "name" : "Validate Create Blank Account"
          }, {
            "id" : 6033,
            "name" : "Validate Create Account With Invalid Data"
          }, {
            "id" : 6034,
            "name" : "Validate User Register Account Invalid Password"
          }, {
            "id" : 6035,
            "name" : "Validate User Register Account Different Password"
          }, {
            "id" : 6036,
            "name" : "Validate Logged User Shopping Cart Remember"
          }, {
            "id" : 6037,
            "name" : "Validate Modify Account And information French"
          }, {
            "id" : 6038,
            "name" : "Validate Modify Account And information English"
          }, {
            "id" : 6039,
            "name" : "Validate information into Login page"
          }, {
            "id" : 6040,
            "name" : "Validate Stay in checkbox"
          }, {
            "id" : 6041,
            "name" : "Validate Forgot password xxx(Inclu dans Validate Login Functions) xxx"
          } ]
        } ]
      }, {
        "id" : 726,
        "name" : "Close Browser",
        "scenarios" : [ {
          "id" : 1334,
          "name" : "Close Browser",
          "steps" : [ {
            "id" : 6042,
            "name" : "Log Of Closing Browser"
          }, {
            "id" : 6043,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 119,
      "name" : "02-DWS Mobile Phone Android (Account Chrome EN) (DIDIER)",
      "functionalities" : [ {
        "id" : 735,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 1351,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 6124,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 6125,
            "name" : "Log Setting Variables (Data Repository)"
          } ]
        }, {
          "id" : 1352,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 6126,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 6127,
            "name" : "Log Of Setting Selenium Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 1353,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 6128,
            "name" : "Setting The Opening Of Browser With Selenium Hub"
          }, {
            "id" : 6149,
            "name" : "Setting The Opening Of Browser With Selenium Hub PC Didier"
          } ]
        } ]
      }, {
        "id" : 736,
        "name" : "Set Language English",
        "scenarios" : [ {
          "id" : 1354,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 6129,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 737,
        "name" : "Copie de Set Language English",
        "scenarios" : [ {
          "id" : 1355,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 6130,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 738,
        "name" : "Validate My Account",
        "scenarios" : [ {
          "id" : 1356,
          "name" : "Validate Login Functions",
          "steps" : [ {
            "id" : 6131,
            "name" : "Validate Login Logout"
          }, {
            "id" : 6132,
            "name" : "Validate Login Forgot Password"
          } ]
        }, {
          "id" : 1357,
          "name" : "Validate User",
          "steps" : [ {
            "id" : 6133,
            "name" : "Validate User Creation"
          }, {
            "id" : 6134,
            "name" : "Validate User Address Creation"
          } ]
        }, {
          "id" : 1358,
          "name" : "Validate Page Account",
          "steps" : [ {
            "id" : 6135,
            "name" : "Validate Create Blank Account"
          }, {
            "id" : 6136,
            "name" : "Validate Create Account With Invalid Data"
          }, {
            "id" : 6137,
            "name" : "Validate User Register Account Invalid Password"
          }, {
            "id" : 6138,
            "name" : "Validate User Register Account Different Password"
          }, {
            "id" : 6139,
            "name" : "Validate Logged User Shopping Cart Remember"
          }, {
            "id" : 6140,
            "name" : "Validate Modify Account And information French"
          }, {
            "id" : 6141,
            "name" : "Validate Modify Account And information English"
          }, {
            "id" : 6142,
            "name" : "Validate information into Login page"
          }, {
            "id" : 6143,
            "name" : "Copie de Validate information into Login page"
          }, {
            "id" : 6144,
            "name" : "Copy of Validate Stay in checkbox Test Yves"
          }, {
            "id" : 6145,
            "name" : "Validate Stay in checkbox"
          }, {
            "id" : 6146,
            "name" : "Validate Forgot password xxx(Inclu dans Validate Login Functions) xxx"
          } ]
        } ]
      }, {
        "id" : 739,
        "name" : "Close Browser",
        "scenarios" : [ {
          "id" : 1359,
          "name" : "Close Browser",
          "steps" : [ {
            "id" : 6147,
            "name" : "Log Of Closing Browser"
          }, {
            "id" : 6148,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 120,
      "name" : "02-DWS Mobile Phone Android (Account Chrome EN) (yves)",
      "functionalities" : [ {
        "id" : 740,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 1360,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 6150,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 6151,
            "name" : "Log Setting Variables (Data Repository)"
          } ]
        }, {
          "id" : 1362,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 6154,
            "name" : "Setting The Opening Of Browser With Selenium Hub"
          } ]
        } ]
      }, {
        "id" : 741,
        "name" : "Set Language English",
        "scenarios" : [ {
          "id" : 1363,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 6155,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 742,
        "name" : "Copie de Set Language English",
        "scenarios" : [ {
          "id" : 1364,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 6156,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 743,
        "name" : "Validate My Account",
        "scenarios" : [ {
          "id" : 1365,
          "name" : "Validate Login Functions",
          "steps" : [ {
            "id" : 6157,
            "name" : "Validate Login Logout"
          }, {
            "id" : 6158,
            "name" : "Validate Login Forgot Password"
          } ]
        }, {
          "id" : 1366,
          "name" : "Validate User",
          "steps" : [ {
            "id" : 6159,
            "name" : "Validate User Creation"
          }, {
            "id" : 6160,
            "name" : "Validate User Address Creation"
          } ]
        }, {
          "id" : 1367,
          "name" : "Validate Page Account",
          "steps" : [ {
            "id" : 6161,
            "name" : "Validate Create Blank Account"
          }, {
            "id" : 6162,
            "name" : "Validate Create Account With Invalid Data"
          }, {
            "id" : 6163,
            "name" : "Validate User Register Account Invalid Password"
          }, {
            "id" : 6164,
            "name" : "Validate User Register Account Different Password"
          }, {
            "id" : 6165,
            "name" : "Validate Logged User Shopping Cart Remember"
          }, {
            "id" : 6166,
            "name" : "Validate Modify Account And information French"
          }, {
            "id" : 6167,
            "name" : "Validate Modify Account And information English"
          }, {
            "id" : 6168,
            "name" : "Validate information into Login page"
          }, {
            "id" : 6169,
            "name" : "Copie de Validate information into Login page"
          }, {
            "id" : 6170,
            "name" : "Copy of Validate Stay in checkbox Test Yves"
          }, {
            "id" : 6171,
            "name" : "Validate Stay in checkbox"
          }, {
            "id" : 6172,
            "name" : "Validate Forgot password xxx(Inclu dans Validate Login Functions) xxx"
          } ]
        }, {
          "id" : 1369,
          "name" : "Copy of Validate Login Functions",
          "steps" : [ {
            "id" : 6175,
            "name" : "Validate Login Logout"
          }, {
            "id" : 6176,
            "name" : "Validate Login Forgot Password"
          } ]
        } ]
      }, {
        "id" : 744,
        "name" : "Close Browser",
        "scenarios" : [ {
          "id" : 1368,
          "name" : "Close Browser",
          "steps" : [ {
            "id" : 6173,
            "name" : "Log Of Closing Browser"
          }, {
            "id" : 6174,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 121,
      "name" : "01-DWS Mobile Phone Android (Product Catalog Chrome EN) (DIDIER)",
      "functionalities" : [ {
        "id" : 745,
        "name" : "01_Setting Of Selenium, Browser And Variables",
        "scenarios" : [ {
          "id" : 1370,
          "name" : "01_Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 6177,
            "name" : "01_Setting Variables (Data Repository)"
          }, {
            "id" : 6178,
            "name" : "02_Log for Data Repository"
          } ]
        }, {
          "id" : 1371,
          "name" : "03_Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 6179,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub Physique"
          }, {
            "id" : 6180,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub Simulator"
          }, {
            "id" : 6181,
            "name" : "02_Log When Browser is opened"
          } ]
        } ]
      }, {
        "id" : 746,
        "name" : "02_Set Language English",
        "scenarios" : [ {
          "id" : 1372,
          "name" : "01_Set Language English",
          "steps" : [ {
            "id" : 6182,
            "name" : "01_Set Language English"
          } ]
        } ]
      }, {
        "id" : 747,
        "name" : "03_Validate Content validation and Browse articles from home page",
        "scenarios" : [ {
          "id" : 1373,
          "name" : "01_Validate Home Page",
          "steps" : [ {
            "id" : 6183,
            "name" : "01_Validate Sticky header"
          }, {
            "id" : 6184,
            "name" : "02_Validate Start shopping Button on Banner and the Shop now"
          } ]
        }, {
          "id" : 1374,
          "name" : "02_Validate Header",
          "steps" : [ {
            "id" : 6185,
            "name" : "01_Validate Top Middle - Header"
          }, {
            "id" : 6186,
            "name" : "02_Validate Low - Header"
          } ]
        } ]
      }, {
        "id" : 748,
        "name" : "04_Validate Shop By Activity and Department - menu & sub-menu items",
        "scenarios" : [ {
          "id" : 1375,
          "name" : "01_Validate All menu and sub-menu for Departments",
          "steps" : [ {
            "id" : 6187,
            "name" : "Validate Sub-menu for Cleaning"
          }, {
            "id" : 6188,
            "name" : "Validate Sub-menu for Clothing"
          }, {
            "id" : 6189,
            "name" : "Validate Sub-menu for Electronics"
          }, {
            "id" : 6190,
            "name" : "Validate Sub-menu for Food"
          }, {
            "id" : 6191,
            "name" : "Validate Sub-menu for Hardware"
          }, {
            "id" : 6192,
            "name" : "Validate Sub-menu for Health & Beauty"
          }, {
            "id" : 6193,
            "name" : "Validate Sub-menu for Home Decor"
          }, {
            "id" : 6194,
            "name" : "Validate Sub-menu for Kitchen"
          }, {
            "id" : 6195,
            "name" : "Validate Sub-menu for Office"
          }, {
            "id" : 6196,
            "name" : "Validate Sub-menu for Party"
          }, {
            "id" : 6197,
            "name" : "Validate Sub-menu for Pets"
          }, {
            "id" : 6198,
            "name" : "Validate Sub-menu for Toys"
          } ]
        }, {
          "id" : 1376,
          "name" : "02_Validate All Menu and sub-menu Activity",
          "steps" : [ {
            "id" : 6199,
            "name" : "Validate menu roll down for Activity"
          }, {
            "id" : 6200,
            "name" : "Validate menu for shop by Activity"
          }, {
            "id" : 6201,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels"
          }, {
            "id" : 6202,
            "name" : "Validate Sub-menu Event, Party & Wedding Planning"
          }, {
            "id" : 6203,
            "name" : "Validate Sub-menu Hospital & Care Facilities"
          }, {
            "id" : 6204,
            "name" : "Validate Sub-menu Maintenance"
          }, {
            "id" : 6205,
            "name" : "Validate Sub-menu Offices"
          }, {
            "id" : 6206,
            "name" : "Validate Sub-menu Schools"
          } ]
        } ]
      }, {
        "id" : 749,
        "name" : "05_Validate Filter",
        "scenarios" : [ {
          "id" : 1377,
          "name" : "01_Validate Filter Department",
          "steps" : [ {
            "id" : 6207,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 6208,
            "name" : "02_Validate Filter By Departments"
          }, {
            "id" : 6209,
            "name" : "03_Validate Filter by Business"
          }, {
            "id" : 6210,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 6211,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 6212,
            "name" : "05_Validate Many Filter Same time"
          } ]
        }, {
          "id" : 1378,
          "name" : "02_Validate Filter Activity",
          "steps" : [ {
            "id" : 6213,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 6214,
            "name" : "02_Validate Filter By Departments"
          }, {
            "id" : 6215,
            "name" : "03_Validate Filter by Business"
          }, {
            "id" : 6216,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 6217,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 6218,
            "name" : "05_Validate Many Filter Same time"
          } ]
        }, {
          "id" : 1379,
          "name" : "02_Validate Filter ActivityOLD",
          "steps" : [ {
            "id" : 6219,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 6220,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 6221,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 6222,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 6223,
            "name" : "05_Validate Many Filters Same time"
          } ]
        } ]
      }, {
        "id" : 750,
        "name" : "06_Validate Short",
        "scenarios" : [ {
          "id" : 1380,
          "name" : "01_Validate Short Department",
          "steps" : [ {
            "id" : 6224,
            "name" : "01_Validate Price per case Low to High"
          }, {
            "id" : 6225,
            "name" : "02_Validate Price per case High to Low"
          }, {
            "id" : 6226,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 6227,
            "name" : "04_Validate Name Z to A"
          }, {
            "id" : 6228,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 6229,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        }, {
          "id" : 1381,
          "name" : "02_Validate Short Activity",
          "steps" : [ {
            "id" : 6230,
            "name" : "01_Validate price per Case Low to High"
          }, {
            "id" : 6231,
            "name" : "02_Validate price per Case High to Low"
          }, {
            "id" : 6232,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 6233,
            "name" : "04_Validatre Name Z to A"
          }, {
            "id" : 6234,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 6235,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        } ]
      }, {
        "id" : 751,
        "name" : "07_Validate Article Page Content",
        "scenarios" : [ {
          "id" : 1382,
          "name" : "01_Validate Department Article Page",
          "steps" : [ {
            "id" : 6236,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 6237,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 6238,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 6239,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 6240,
            "name" : "05_Validate Article title"
          }, {
            "id" : 6241,
            "name" : "06_Validate You may also like"
          }, {
            "id" : 6242,
            "name" : "Copy of 03_Validate Add Favorite in article page"
          } ]
        }, {
          "id" : 1383,
          "name" : "02_Validate Activity Article Page",
          "steps" : [ {
            "id" : 6243,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 6244,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 6245,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 6246,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 6247,
            "name" : "05_Validate Article title"
          }, {
            "id" : 6248,
            "name" : "06_Validate You may also like"
          } ]
        } ]
      }, {
        "id" : 752,
        "name" : "08_Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 1384,
          "name" : "01_UnMap And Delete Directory",
          "steps" : [ {
            "id" : 6249,
            "name" : "01_Log To UnMap"
          }, {
            "id" : 6250,
            "name" : "02_Un Map and Delete The Directory On Server And Virtual Machine"
          } ]
        }, {
          "id" : 1385,
          "name" : "02_Close browser",
          "steps" : [ {
            "id" : 6251,
            "name" : "01_Logging of the Teardown"
          }, {
            "id" : 6252,
            "name" : "02_Close Application Mobile"
          } ]
        } ]
      } ]
    }, {
      "id" : 59,
      "name" : "99_DWS (Desktop My Account IE FR)(OLD)",
      "functionalities" : [ {
        "id" : 346,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 662,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 2893,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 2894,
            "name" : "Log Setting Variables (Data Repository)"
          } ]
        }, {
          "id" : 663,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 2895,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 2896,
            "name" : "Log Of Setting Selenium Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 664,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 2897,
            "name" : "Setting The Opening Of Browser With Selenium Hub"
          } ]
        } ]
      }, {
        "id" : 347,
        "name" : "Set Language English",
        "scenarios" : [ {
          "id" : 665,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 2898,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 348,
        "name" : "Validate My Account",
        "scenarios" : [ {
          "id" : 666,
          "name" : "Validate Login Functions",
          "steps" : [ {
            "id" : 2899,
            "name" : "Validate Login Logout"
          }, {
            "id" : 2900,
            "name" : "Validate Login Forgot Password"
          } ]
        }, {
          "id" : 667,
          "name" : "Validate User",
          "steps" : [ {
            "id" : 2901,
            "name" : "Validate User Creation"
          }, {
            "id" : 2902,
            "name" : "Validate User Address Creation"
          } ]
        }, {
          "id" : 668,
          "name" : "Validate Page Account",
          "steps" : [ {
            "id" : 2903,
            "name" : "Validate Create Blank Account"
          }, {
            "id" : 2904,
            "name" : "Validate Create Account With Invalid Data"
          }, {
            "id" : 2905,
            "name" : "Validate User Register Account Invalid Password"
          }, {
            "id" : 2906,
            "name" : "Validate User Register Account Different Password"
          }, {
            "id" : 2907,
            "name" : "Validate Logged User Shopping Cart Remember"
          }, {
            "id" : 2908,
            "name" : "Validate Modify Account And information English"
          }, {
            "id" : 2909,
            "name" : "Validate Modify Account And information French"
          }, {
            "id" : 2910,
            "name" : "Validate information into Login page"
          }, {
            "id" : 2911,
            "name" : "Validate Stay in checkbox"
          }, {
            "id" : 2912,
            "name" : "Validate Forgot password xxx(Inclu dans Validate Login Functions) xxx"
          } ]
        } ]
      }, {
        "id" : 349,
        "name" : "Close Browser",
        "scenarios" : [ {
          "id" : 669,
          "name" : "Close Browser",
          "steps" : [ {
            "id" : 2913,
            "name" : "Log Of Closing Browser"
          }, {
            "id" : 2914,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 48,
      "name" : "99_DWS (Desktop My Account IE EN)(OLD)",
      "functionalities" : [ {
        "id" : 274,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 523,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 2281,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 2282,
            "name" : "Log Setting Variables (Data Repository)"
          } ]
        }, {
          "id" : 524,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 2283,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 2284,
            "name" : "Log Of Setting Selenium Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 525,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 2285,
            "name" : "Setting The Opening Of Browser With Selenium Hub"
          } ]
        } ]
      }, {
        "id" : 275,
        "name" : "Set Language English",
        "scenarios" : [ {
          "id" : 526,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 2286,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 276,
        "name" : "Validate My Account",
        "scenarios" : [ {
          "id" : 527,
          "name" : "Validate Login Functions",
          "steps" : [ {
            "id" : 2287,
            "name" : "Validate Login Logout"
          }, {
            "id" : 2288,
            "name" : "Validate Login Forgot Password"
          } ]
        }, {
          "id" : 528,
          "name" : "Validate User",
          "steps" : [ {
            "id" : 2289,
            "name" : "Validate User Creation"
          }, {
            "id" : 2290,
            "name" : "Validate User Address Creation"
          } ]
        }, {
          "id" : 529,
          "name" : "Validate Page Account",
          "steps" : [ {
            "id" : 2291,
            "name" : "Validate Create Blank Account"
          }, {
            "id" : 2292,
            "name" : "Validate Create Account With Invalid Data"
          }, {
            "id" : 2293,
            "name" : "Validate User Register Account Invalid Password"
          }, {
            "id" : 2294,
            "name" : "Validate User Register Account Different Password"
          }, {
            "id" : 2295,
            "name" : "Validate Logged User Shopping Cart Remember"
          }, {
            "id" : 2296,
            "name" : "Validate Modify Account And information French"
          }, {
            "id" : 2297,
            "name" : "Validate Modify Account And information English"
          }, {
            "id" : 2298,
            "name" : "Validate information into Login page"
          }, {
            "id" : 2299,
            "name" : "Validate Stay in checkbox"
          }, {
            "id" : 2300,
            "name" : "Validate Forgot password xxx(Inclu dans Validate Login Functions) xxx"
          } ]
        } ]
      }, {
        "id" : 277,
        "name" : "Close Browser",
        "scenarios" : [ {
          "id" : 530,
          "name" : "Close Browser",
          "steps" : [ {
            "id" : 2301,
            "name" : "Log Of Closing Browser"
          }, {
            "id" : 2302,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 93,
      "name" : "99_DWS (Desktop My Account QA FireFox FR)",
      "functionalities" : [ {
        "id" : 572,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 1067,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 4846,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 4847,
            "name" : "Log Setting Variables (Data Repository)"
          } ]
        }, {
          "id" : 1068,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 4848,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 4849,
            "name" : "Log Of Setting Selenium Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 1069,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 4850,
            "name" : "Setting The Opening Of Browser With Selenium Hub"
          } ]
        } ]
      }, {
        "id" : 573,
        "name" : "Set Language English",
        "scenarios" : [ {
          "id" : 1070,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 4851,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 574,
        "name" : "Validate My Account",
        "scenarios" : [ {
          "id" : 1071,
          "name" : "Validate Login Functions",
          "steps" : [ {
            "id" : 4852,
            "name" : "Validate Login Logout"
          }, {
            "id" : 4853,
            "name" : "Validate Login Forgot Password"
          } ]
        }, {
          "id" : 1072,
          "name" : "Validate User",
          "steps" : [ {
            "id" : 4854,
            "name" : "Validate User Creation"
          }, {
            "id" : 4855,
            "name" : "Validate User Address Creation"
          } ]
        }, {
          "id" : 1073,
          "name" : "Validate Page Account",
          "steps" : [ {
            "id" : 4856,
            "name" : "Validate Create Blank Account"
          }, {
            "id" : 4857,
            "name" : "Validate Create Account With Invalid Data"
          }, {
            "id" : 4858,
            "name" : "Validate User Register Account Invalid Password"
          }, {
            "id" : 4859,
            "name" : "Validate User Register Account Different Password"
          }, {
            "id" : 4860,
            "name" : "Validate Logged User Shopping Cart Remember"
          }, {
            "id" : 4861,
            "name" : "Validate Modify Account And information English"
          }, {
            "id" : 4862,
            "name" : "Validate Modify Account And information French"
          }, {
            "id" : 4863,
            "name" : "Validate information into Login page"
          }, {
            "id" : 4864,
            "name" : "Validate Stay in checkbox"
          }, {
            "id" : 4865,
            "name" : "Validate Forgot password xxx(Inclu dans Validate Login Functions) xxx"
          } ]
        } ]
      }, {
        "id" : 575,
        "name" : "Close Browser",
        "scenarios" : [ {
          "id" : 1074,
          "name" : "Close Browser",
          "steps" : [ {
            "id" : 4866,
            "name" : "Log Of Closing Browser"
          }, {
            "id" : 4867,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 143,
      "name" : "Final_02-DWS Mobile Tablette Android (Account Chrome EN) (Edmond_Tablette)",
      "functionalities" : [ {
        "id" : 866,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 1619,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 7258,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 7259,
            "name" : "Log Setting Variables (Data Repository)"
          } ]
        }, {
          "id" : 1620,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 7260,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 7261,
            "name" : "Log Of Setting Selenium Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 1621,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 7262,
            "name" : "Setting The Opening Of Browser With Selenium Hub houcine"
          }, {
            "id" : 7263,
            "name" : "Setting The Opening Of Browser With Selenium Hub"
          } ]
        } ]
      }, {
        "id" : 867,
        "name" : "Set Language English",
        "scenarios" : [ {
          "id" : 1622,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 7264,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 868,
        "name" : "Copie de Set Language English",
        "scenarios" : [ {
          "id" : 1623,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 7265,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 869,
        "name" : "Validate My Account",
        "scenarios" : [ {
          "id" : 1624,
          "name" : "Validate Login Functions",
          "steps" : [ {
            "id" : 7266,
            "name" : "Validate Login Logout"
          }, {
            "id" : 7267,
            "name" : "Validate Login Forgot Password"
          }, {
            "id" : 7268,
            "name" : "Copy of Validate Login Forgot Password"
          } ]
        }, {
          "id" : 1625,
          "name" : "Validate User",
          "steps" : [ {
            "id" : 7269,
            "name" : "Final_Validate User Creation"
          }, {
            "id" : 7270,
            "name" : "Validate User Address Creation_brouillon"
          }, {
            "id" : 7271,
            "name" : "Copy of Validate User Address Creation"
          }, {
            "id" : 7272,
            "name" : "Final_Validate User Address Creation"
          } ]
        }, {
          "id" : 1626,
          "name" : "Validate Page Account",
          "steps" : [ {
            "id" : 7273,
            "name" : "Validate Create Blank Account"
          }, {
            "id" : 7274,
            "name" : "Validate Create Account With Invalid Data_edmond"
          }, {
            "id" : 7275,
            "name" : "Validate User Register Account Invalid Password"
          }, {
            "id" : 7276,
            "name" : "Validate User Register Account Different Password"
          }, {
            "id" : 7277,
            "name" : "Validate Modify Account And information French"
          }, {
            "id" : 7278,
            "name" : "Validate Modify Account And information English"
          }, {
            "id" : 7279,
            "name" : "Validate information into Login page"
          }, {
            "id" : 7280,
            "name" : "Copy of Validate Stay in checkbox Test Yves"
          }, {
            "id" : 7281,
            "name" : "Validate Stay in checkbox"
          }, {
            "id" : 7282,
            "name" : "Validate Logged User Shopping Cart Remember"
          }, {
            "id" : 7283,
            "name" : "Validate Forgot password xxx(Inclu dans Validate Login Functions) xxx"
          } ]
        } ]
      }, {
        "id" : 870,
        "name" : "Close Browser",
        "scenarios" : [ {
          "id" : 1627,
          "name" : "Close Browser",
          "steps" : [ {
            "id" : 7284,
            "name" : "Log Of Closing Browser"
          }, {
            "id" : 7285,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 122,
      "name" : "01-DWS Mobile Phone Android (Product Catalog Chrome EN) (Pour Yves)",
      "functionalities" : [ {
        "id" : 753,
        "name" : "01_Setting Of Selenium, Browser And Variables",
        "scenarios" : [ {
          "id" : 1386,
          "name" : "01_Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 6253,
            "name" : "01_Setting Variables (Data Repository)"
          }, {
            "id" : 6254,
            "name" : "02_Log for Data Repository"
          } ]
        }, {
          "id" : 1387,
          "name" : "03_Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 6255,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub Physique"
          }, {
            "id" : 6256,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub Simulator"
          }, {
            "id" : 6257,
            "name" : "02_Log When Browser is opened"
          } ]
        } ]
      }, {
        "id" : 754,
        "name" : "02_Set Language English",
        "scenarios" : [ {
          "id" : 1388,
          "name" : "01_Set Language English",
          "steps" : [ {
            "id" : 6258,
            "name" : "01_Set Language English"
          } ]
        } ]
      }, {
        "id" : 755,
        "name" : "03_Validate Content validation and Browse articles from home page",
        "scenarios" : [ {
          "id" : 1389,
          "name" : "01_Validate Home Page",
          "steps" : [ {
            "id" : 6259,
            "name" : "01_Validate Sticky header"
          }, {
            "id" : 6260,
            "name" : "02_Validate Start shopping Button on Banner and the Shop now"
          } ]
        }, {
          "id" : 1390,
          "name" : "02_Validate Header",
          "steps" : [ {
            "id" : 6261,
            "name" : "01_Validate Top Middle - Header"
          }, {
            "id" : 6262,
            "name" : "02_Validate Low - Header"
          } ]
        } ]
      }, {
        "id" : 756,
        "name" : "04_Validate Shop By Activity and Department - menu & sub-menu items",
        "scenarios" : [ {
          "id" : 1402,
          "name" : "TestLogin",
          "steps" : [ {
            "id" : 6330,
            "name" : "Test Login"
          } ]
        }, {
          "id" : 1391,
          "name" : "01_Validate All menu and sub-menu for Departments",
          "steps" : [ {
            "id" : 6263,
            "name" : "Validate Sub-menu for Cleaning"
          }, {
            "id" : 6264,
            "name" : "Validate Sub-menu for Clothing"
          }, {
            "id" : 6265,
            "name" : "Validate Sub-menu for Electronics"
          }, {
            "id" : 6266,
            "name" : "Validate Sub-menu for Food"
          }, {
            "id" : 6267,
            "name" : "Validate Sub-menu for Hardware"
          }, {
            "id" : 6268,
            "name" : "Validate Sub-menu for Health & Beauty"
          }, {
            "id" : 6269,
            "name" : "Validate Sub-menu for Home Decor"
          }, {
            "id" : 6270,
            "name" : "Validate Sub-menu for Kitchen"
          }, {
            "id" : 6271,
            "name" : "Validate Sub-menu for Office"
          }, {
            "id" : 6272,
            "name" : "Validate Sub-menu for Party"
          }, {
            "id" : 6273,
            "name" : "Validate Sub-menu for Pets"
          }, {
            "id" : 6274,
            "name" : "Validate Sub-menu for Toys"
          } ]
        }, {
          "id" : 1392,
          "name" : "02_Validate All Menu and sub-menu Activity",
          "steps" : [ {
            "id" : 6275,
            "name" : "Validate menu roll down for Activity"
          }, {
            "id" : 6276,
            "name" : "Validate menu for shop by Activity"
          }, {
            "id" : 6277,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels"
          }, {
            "id" : 6278,
            "name" : "Validate Sub-menu Event, Party & Wedding Planning"
          }, {
            "id" : 6279,
            "name" : "Validate Sub-menu Hospital & Care Facilities"
          }, {
            "id" : 6280,
            "name" : "Validate Sub-menu Maintenance"
          }, {
            "id" : 6281,
            "name" : "Validate Sub-menu Offices"
          }, {
            "id" : 6282,
            "name" : "Validate Sub-menu Schools"
          } ]
        } ]
      }, {
        "id" : 757,
        "name" : "05_Validate Filter",
        "scenarios" : [ {
          "id" : 1393,
          "name" : "01_Validate Filter Department",
          "steps" : [ {
            "id" : 6283,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 6284,
            "name" : "02_Validate Filter By Departments"
          }, {
            "id" : 6285,
            "name" : "03_Validate Filter by Business"
          }, {
            "id" : 6286,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 6287,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 6288,
            "name" : "05_Validate Many Filter Same time"
          } ]
        }, {
          "id" : 1394,
          "name" : "02_Validate Filter Activity",
          "steps" : [ {
            "id" : 6289,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 6290,
            "name" : "02_Validate Filter By Departments"
          }, {
            "id" : 6291,
            "name" : "03_Validate Filter by Business"
          }, {
            "id" : 6292,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 6293,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 6294,
            "name" : "05_Validate Many Filter Same time"
          } ]
        }, {
          "id" : 1395,
          "name" : "02_Validate Filter ActivityOLD",
          "steps" : [ {
            "id" : 6295,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 6296,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 6297,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 6298,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 6299,
            "name" : "05_Validate Many Filters Same time"
          } ]
        } ]
      }, {
        "id" : 758,
        "name" : "06_Validate Short",
        "scenarios" : [ {
          "id" : 1396,
          "name" : "01_Validate Short Department",
          "steps" : [ {
            "id" : 6300,
            "name" : "01_Validate Price per case Low to High"
          }, {
            "id" : 6301,
            "name" : "02_Validate Price per case High to Low"
          }, {
            "id" : 6302,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 6303,
            "name" : "04_Validate Name Z to A"
          }, {
            "id" : 6304,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 6305,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        }, {
          "id" : 1397,
          "name" : "02_Validate Short Activity",
          "steps" : [ {
            "id" : 6306,
            "name" : "01_Validate price per Case Low to High"
          }, {
            "id" : 6307,
            "name" : "02_Validate price per Case High to Low"
          }, {
            "id" : 6308,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 6309,
            "name" : "04_Validatre Name Z to A"
          }, {
            "id" : 6310,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 6311,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        } ]
      }, {
        "id" : 759,
        "name" : "07_Validate Article Page Content",
        "scenarios" : [ {
          "id" : 1398,
          "name" : "01_Validate Department Article Page",
          "steps" : [ {
            "id" : 6312,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 6313,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 6314,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 6315,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 6316,
            "name" : "05_Validate Article title"
          }, {
            "id" : 6317,
            "name" : "06_Validate You may also like"
          }, {
            "id" : 6318,
            "name" : "Copy of 03_Validate Add Favorite in article page"
          } ]
        }, {
          "id" : 1399,
          "name" : "02_Validate Activity Article Page",
          "steps" : [ {
            "id" : 6319,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 6320,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 6321,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 6322,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 6323,
            "name" : "05_Validate Article title"
          }, {
            "id" : 6324,
            "name" : "06_Validate You may also like"
          } ]
        } ]
      }, {
        "id" : 760,
        "name" : "08_Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 1400,
          "name" : "01_UnMap And Delete Directory",
          "steps" : [ {
            "id" : 6325,
            "name" : "01_Log To UnMap"
          }, {
            "id" : 6326,
            "name" : "02_Un Map and Delete The Directory On Server And Virtual Machine"
          } ]
        }, {
          "id" : 1401,
          "name" : "02_Close browser",
          "steps" : [ {
            "id" : 6327,
            "name" : "01_Logging of the Teardown"
          }, {
            "id" : 6328,
            "name" : "02_Close Application Mobile"
          } ]
        } ]
      } ]
    }, {
      "id" : 113,
      "name" : "02_DWS (Desktop My Account Safari FR)",
      "functionalities" : [ {
        "id" : 697,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 1284,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 5810,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 5811,
            "name" : "Log Setting Variables (Data Repository)"
          } ]
        }, {
          "id" : 1285,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 5812,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 5813,
            "name" : "Log Of Setting Selenium Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 1286,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 5814,
            "name" : "Setting The Opening Of Browser With Selenium Hub"
          } ]
        } ]
      }, {
        "id" : 698,
        "name" : "Set Language English",
        "scenarios" : [ {
          "id" : 1287,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 5815,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 699,
        "name" : "Validate My Account",
        "scenarios" : [ {
          "id" : 1288,
          "name" : "Validate Login Functions",
          "steps" : [ {
            "id" : 5816,
            "name" : "Validate Login Logout"
          }, {
            "id" : 5817,
            "name" : "Validate Login Forgot Password"
          } ]
        }, {
          "id" : 1289,
          "name" : "Validate User",
          "steps" : [ {
            "id" : 5818,
            "name" : "Validate User Creation"
          }, {
            "id" : 5819,
            "name" : "Validate User Address Creation"
          } ]
        }, {
          "id" : 1290,
          "name" : "Validate Page Account",
          "steps" : [ {
            "id" : 5820,
            "name" : "Validate Create Blank Account"
          }, {
            "id" : 5821,
            "name" : "Validate Create Account With Invalid Data"
          }, {
            "id" : 5822,
            "name" : "Validate User Register Account Invalid Password"
          }, {
            "id" : 5823,
            "name" : "Validate User Register Account Different Password"
          }, {
            "id" : 5824,
            "name" : "Validate Logged User Shopping Cart Remember"
          }, {
            "id" : 5825,
            "name" : "Validate Modify Account And information English"
          }, {
            "id" : 5826,
            "name" : "Validate Modify Account And information French"
          }, {
            "id" : 5827,
            "name" : "Validate information into Login page"
          }, {
            "id" : 5828,
            "name" : "Validate Stay in checkbox"
          }, {
            "id" : 5829,
            "name" : "Validate Forgot password xxx(Inclu dans Validate Login Functions) xxx"
          } ]
        } ]
      }, {
        "id" : 700,
        "name" : "Close Browser",
        "scenarios" : [ {
          "id" : 1291,
          "name" : "Close Browser",
          "steps" : [ {
            "id" : 5830,
            "name" : "Log Of Closing Browser"
          }, {
            "id" : 5831,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 123,
      "name" : "01-DWS Mobile Phone Android (Product Catalog Chrome EN) Amira final",
      "functionalities" : [ {
        "id" : 761,
        "name" : "01_Setting Of Selenium, Browser And Variables",
        "scenarios" : [ {
          "id" : 1404,
          "name" : "01_Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 6355,
            "name" : "01_Setting Variables (Data Repository)"
          }, {
            "id" : 6356,
            "name" : "02_Log for Data Repository"
          } ]
        }, {
          "id" : 1405,
          "name" : "03_Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 6357,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub Physique"
          }, {
            "id" : 6358,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub Simulator"
          }, {
            "id" : 6359,
            "name" : "02_Log When Browser is opened"
          } ]
        } ]
      }, {
        "id" : 762,
        "name" : "02_Set Language English",
        "scenarios" : [ {
          "id" : 1406,
          "name" : "01_Set Language English",
          "steps" : [ {
            "id" : 6360,
            "name" : "01_Set Language English"
          } ]
        } ]
      }, {
        "id" : 763,
        "name" : "03_Validate Content validation and Browse articles from home page",
        "scenarios" : [ {
          "id" : 1407,
          "name" : "01_Validate Home Page",
          "steps" : [ {
            "id" : 6361,
            "name" : "01_Validate Sticky header"
          }, {
            "id" : 6362,
            "name" : "02_Validate Start shopping Button on Banner and the Shop now"
          } ]
        }, {
          "id" : 1408,
          "name" : "02_Validate Header",
          "steps" : [ {
            "id" : 6363,
            "name" : "01_Validate Top Middle - Header"
          }, {
            "id" : 6364,
            "name" : "02_Validate Low - Header"
          } ]
        } ]
      }, {
        "id" : 764,
        "name" : "04_Validate Shop By Activity and Department - menu & sub-menu items",
        "scenarios" : [ {
          "id" : 1410,
          "name" : "01_Validate All menu and sub-menu for Departments",
          "steps" : [ {
            "id" : 6366,
            "name" : "Validate Sub-menu for Cleaning"
          }, {
            "id" : 6367,
            "name" : "Validate Sub-menu for Clothing"
          }, {
            "id" : 6368,
            "name" : "Validate Sub-menu for Electronics"
          }, {
            "id" : 6369,
            "name" : "Validate Sub-menu for Food"
          }, {
            "id" : 6370,
            "name" : "Validate Sub-menu for Hardware"
          }, {
            "id" : 6371,
            "name" : "Validate Sub-menu for Health & Beauty"
          }, {
            "id" : 6612,
            "name" : "Validate Sub-menu for Home Decor"
          }, {
            "id" : 6373,
            "name" : "Validate Sub-menu for Kitchen--"
          }, {
            "id" : 6613,
            "name" : "Validate Sub-menu for Office"
          }, {
            "id" : 6375,
            "name" : "Validate Sub-menu for Party--"
          }, {
            "id" : 6376,
            "name" : "Validate Sub-menu for Pets--"
          }, {
            "id" : 6377,
            "name" : "Validate Sub-menu for Toys"
          }, {
            "id" : 6614,
            "name" : "Copie de Validate Sub-menu for Cleaning-Menu complet-"
          } ]
        }, {
          "id" : 1411,
          "name" : "02_Validate All Menu and sub-menu Activity",
          "steps" : [ {
            "id" : 6380,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels"
          }, {
            "id" : 6381,
            "name" : "Validate Sub-menu Event, Party & Wedding Planning"
          }, {
            "id" : 6498,
            "name" : "Validate Sub-menu Hospital & Care Facilities"
          }, {
            "id" : 6499,
            "name" : "Validate Sub-menu Maintenance"
          }, {
            "id" : 6500,
            "name" : "Validate Sub-menu Offices"
          }, {
            "id" : 6507,
            "name" : "Validate Sub-menu Schools"
          }, {
            "id" : 6503,
            "name" : "Copie de Validate Sub-menu Catering, Restaurants & Hotels(menu complet)"
          }, {
            "id" : 6505,
            "name" : "Copie de Validate Sub-menu Hospital & Care Facilities(Menu complet)"
          }, {
            "id" : 6502,
            "name" : "Copie de Validate Sub-menu Offices(menu complet)"
          }, {
            "id" : 6508,
            "name" : "Copie de Validate Sub-menu Schools(Menu complet)"
          } ]
        }, {
          "id" : 1434,
          "name" : "Copie de 02_Validate All Menu and sub-menu Activity Sauvegarde",
          "steps" : [ {
            "id" : 6509,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels"
          }, {
            "id" : 6510,
            "name" : "Validate Sub-menu Event, Party & Wedding Planning"
          }, {
            "id" : 6511,
            "name" : "Validate Sub-menu Hospital & Care Facilities"
          }, {
            "id" : 6512,
            "name" : "Validate Sub-menu Maintenance"
          }, {
            "id" : 6513,
            "name" : "Validate Sub-menu Offices"
          }, {
            "id" : 6514,
            "name" : "Validate Sub-menu Schools"
          }, {
            "id" : 6515,
            "name" : "Copie de Validate Sub-menu Catering, Restaurants & Hotels(menu complet)"
          }, {
            "id" : 6516,
            "name" : "Copie de Validate Sub-menu Hospital & Care Facilities(Menu complet)"
          }, {
            "id" : 6517,
            "name" : "Copie de Validate Sub-menu Offices(menu complet)"
          }, {
            "id" : 6518,
            "name" : "Copie de Validate Sub-menu Schools(Menu complet)"
          } ]
        }, {
          "id" : 1468,
          "name" : "Copie de 01_Validate All menu and sub-menu for Departments sauvegarde",
          "steps" : [ {
            "id" : 6615,
            "name" : "Validate Sub-menu for Cleaning"
          }, {
            "id" : 6616,
            "name" : "Validate Sub-menu for Clothing"
          }, {
            "id" : 6617,
            "name" : "Validate Sub-menu for Electronics"
          }, {
            "id" : 6618,
            "name" : "Validate Sub-menu for Food"
          }, {
            "id" : 6619,
            "name" : "Validate Sub-menu for Hardware"
          }, {
            "id" : 6620,
            "name" : "Validate Sub-menu for Health & Beauty"
          }, {
            "id" : 6621,
            "name" : "Validate Sub-menu for Home Decor"
          }, {
            "id" : 6622,
            "name" : "Validate Sub-menu for Kitchen--"
          }, {
            "id" : 6623,
            "name" : "Validate Sub-menu for Office"
          }, {
            "id" : 6624,
            "name" : "Validate Sub-menu for Party--"
          }, {
            "id" : 6625,
            "name" : "Validate Sub-menu for Pets--"
          }, {
            "id" : 6626,
            "name" : "Validate Sub-menu for Toys"
          }, {
            "id" : 6627,
            "name" : "Copie de Validate Sub-menu for Cleaning-Menu complet-"
          } ]
        } ]
      }, {
        "id" : 765,
        "name" : "05_Validate Filter",
        "scenarios" : [ {
          "id" : 1412,
          "name" : "01_Validate Filter Department",
          "steps" : [ {
            "id" : 6386,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 6387,
            "name" : "02_Validate Filter By Departments"
          }, {
            "id" : 6388,
            "name" : "03_Validate Filter by Activities"
          }, {
            "id" : 6389,
            "name" : "04_Validate Filter by Brand"
          }, {
            "id" : 6390,
            "name" : "05_Validate Filter by Unit Price"
          }, {
            "id" : 6391,
            "name" : "06_Validate Many Filter Same time"
          } ]
        }, {
          "id" : 1413,
          "name" : "02_Validate Filter Activity",
          "steps" : [ {
            "id" : 6392,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 6393,
            "name" : "02_Validate Filter By Departments"
          }, {
            "id" : 6394,
            "name" : "03_Validate Filter by Business"
          }, {
            "id" : 6395,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 6396,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 6397,
            "name" : "05_Validate Many Filter Same time"
          } ]
        }, {
          "id" : 1414,
          "name" : "02_Validate Filter ActivityOLD",
          "steps" : [ {
            "id" : 6398,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 6399,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 6400,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 6401,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 6402,
            "name" : "05_Validate Many Filters Same time"
          } ]
        } ]
      }, {
        "id" : 766,
        "name" : "06_Validate Short",
        "scenarios" : [ {
          "id" : 1415,
          "name" : "01_Validate Short Department",
          "steps" : [ {
            "id" : 6403,
            "name" : "01_Validate Price per case Low to High"
          }, {
            "id" : 6404,
            "name" : "02_Validate Price per case High to Low"
          }, {
            "id" : 6405,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 6406,
            "name" : "04_Validate Name Z to A"
          }, {
            "id" : 6407,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 6408,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        }, {
          "id" : 1416,
          "name" : "02_Validate Short Activity",
          "steps" : [ {
            "id" : 6409,
            "name" : "01_Validate price per Case Low to High"
          }, {
            "id" : 6410,
            "name" : "02_Validate price per Case High to Low"
          }, {
            "id" : 6411,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 6412,
            "name" : "04_Validatre Name Z to A"
          }, {
            "id" : 6413,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 6414,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        } ]
      }, {
        "id" : 767,
        "name" : "07_Validate Article Page Content",
        "scenarios" : [ {
          "id" : 1417,
          "name" : "01_Validate Department Article Page",
          "steps" : [ {
            "id" : 6415,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 6416,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 6417,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 6418,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 6419,
            "name" : "05_Validate Article title"
          }, {
            "id" : 6420,
            "name" : "06_Validate You may also like"
          } ]
        }, {
          "id" : 1609,
          "name" : "02_Validate Activity Article Page.",
          "steps" : [ {
            "id" : 7203,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 7204,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 7205,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 7206,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 7207,
            "name" : "05_Validate Article title"
          }, {
            "id" : 7208,
            "name" : "06_Validate You may also like"
          } ]
        } ]
      }, {
        "id" : 768,
        "name" : "08_Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 1419,
          "name" : "01_UnMap And Delete Directory",
          "steps" : [ {
            "id" : 6428,
            "name" : "01_Log To UnMap"
          }, {
            "id" : 6429,
            "name" : "02_Un Map and Delete The Directory On Server And Virtual Machine"
          } ]
        }, {
          "id" : 1420,
          "name" : "02_Close browser",
          "steps" : [ {
            "id" : 6430,
            "name" : "01_Logging of the Teardown"
          }, {
            "id" : 6431,
            "name" : "02_Close Application Mobile"
          } ]
        } ]
      }, {
        "id" : 791,
        "name" : "Copie de 05_Validate Filter",
        "scenarios" : [ {
          "id" : 1469,
          "name" : "01_Validate Filter Department",
          "steps" : [ {
            "id" : 6628,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 6629,
            "name" : "02_Validate Filter By Departments"
          }, {
            "id" : 6630,
            "name" : "03_Validate Filter by Business"
          }, {
            "id" : 6631,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 6632,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 6633,
            "name" : "05_Validate Many Filter Same time"
          } ]
        }, {
          "id" : 1470,
          "name" : "02_Validate Filter Activity",
          "steps" : [ {
            "id" : 6634,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 6635,
            "name" : "02_Validate Filter By Departments"
          }, {
            "id" : 6636,
            "name" : "03_Validate Filter by Business"
          }, {
            "id" : 6637,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 6638,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 6639,
            "name" : "05_Validate Many Filter Same time"
          } ]
        }, {
          "id" : 1471,
          "name" : "02_Validate Filter ActivityOLD",
          "steps" : [ {
            "id" : 6640,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 6641,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 6642,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 6643,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 6644,
            "name" : "05_Validate Many Filters Same time"
          } ]
        } ]
      } ]
    }, {
      "id" : 124,
      "name" : "Final_02-DWS Mobile Phone Android (Account Chrome EN) (Edmond)",
      "functionalities" : [ {
        "id" : 769,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 1421,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 6432,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 6433,
            "name" : "Log Setting Variables (Data Repository)"
          } ]
        }, {
          "id" : 1422,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 6434,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 6435,
            "name" : "Log Of Setting Selenium Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 1423,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 6436,
            "name" : "Setting The Opening Of Browser With Selenium Hub houcine"
          }, {
            "id" : 6437,
            "name" : "Setting The Opening Of Browser With Selenium Hub"
          } ]
        } ]
      }, {
        "id" : 770,
        "name" : "Set Language English",
        "scenarios" : [ {
          "id" : 1424,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 6438,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 771,
        "name" : "Copie de Set Language English",
        "scenarios" : [ {
          "id" : 1425,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 6439,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 772,
        "name" : "Validate My Account",
        "scenarios" : [ {
          "id" : 1426,
          "name" : "Validate Login Functions",
          "steps" : [ {
            "id" : 6440,
            "name" : "Validate Login Logout"
          }, {
            "id" : 6441,
            "name" : "Validate Login Forgot Password"
          }, {
            "id" : 7188,
            "name" : "Copy of Validate Login Forgot Password"
          } ]
        }, {
          "id" : 1427,
          "name" : "Validate User",
          "steps" : [ {
            "id" : 6442,
            "name" : "Final_Validate User Creation"
          }, {
            "id" : 6443,
            "name" : "Validate User Address Creation_brouillon"
          }, {
            "id" : 6491,
            "name" : "Copy of Validate User Address Creation"
          }, {
            "id" : 6887,
            "name" : "Final_Validate User Address Creation"
          } ]
        }, {
          "id" : 1428,
          "name" : "Validate Page Account",
          "steps" : [ {
            "id" : 6444,
            "name" : "Validate Create Blank Account"
          }, {
            "id" : 6934,
            "name" : "Validate Create Account With Invalid Data_edmond"
          }, {
            "id" : 6446,
            "name" : "Validate User Register Account Invalid Password"
          }, {
            "id" : 6447,
            "name" : "Validate User Register Account Different Password"
          }, {
            "id" : 6449,
            "name" : "Validate Modify Account And information French"
          }, {
            "id" : 7132,
            "name" : "Validate Modify Account And information English"
          }, {
            "id" : 6451,
            "name" : "Validate information into Login page"
          }, {
            "id" : 6453,
            "name" : "Copy of Validate Stay in checkbox Test Yves"
          }, {
            "id" : 6454,
            "name" : "Validate Stay in checkbox"
          }, {
            "id" : 6448,
            "name" : "Validate Logged User Shopping Cart Remember"
          }, {
            "id" : 6455,
            "name" : "Validate Forgot password xxx(Inclu dans Validate Login Functions) xxx"
          } ]
        } ]
      }, {
        "id" : 773,
        "name" : "Close Browser",
        "scenarios" : [ {
          "id" : 1429,
          "name" : "Close Browser",
          "steps" : [ {
            "id" : 6456,
            "name" : "Log Of Closing Browser"
          }, {
            "id" : 6457,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 145,
      "name" : "03-DWS Mobile Tablet Android (Shopping and Checkout Chrome FR)(Bujor)",
      "functionalities" : [ {
        "id" : 876,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 1637,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 7314,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 7315,
            "name" : "Login Info"
          } ]
        }, {
          "id" : 1638,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 7316,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 7317,
            "name" : "Logging of Setting Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 1639,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 7318,
            "name" : "Open Browser With Type Of Browser And Selenium Hub"
          }, {
            "id" : 7319,
            "name" : "Open Browser With Type Of Browser And Selenium Hub (Bujor)"
          }, {
            "id" : 7320,
            "name" : "Log Information"
          } ]
        } ]
      }, {
        "id" : 877,
        "name" : "Set Language English",
        "scenarios" : [ {
          "id" : 1640,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 7321,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 878,
        "name" : "Validate An Anonymous Action",
        "scenarios" : [ {
          "id" : 1641,
          "name" : "Validate Favorite",
          "steps" : [ {
            "id" : 7322,
            "name" : "Validate Favorite Header"
          }, {
            "id" : 7323,
            "name" : "Validate Adding an article to Wish list from Department Page"
          }, {
            "id" : 7324,
            "name" : "Validate Adding an article to Wish list from You may also like on Article Page"
          }, {
            "id" : 7325,
            "name" : "Validate Adding an article to Wish list from Search Results Page"
          }, {
            "id" : 7326,
            "name" : "Validate Adding an article to Wish list from Article Page"
          } ]
        } ]
      }, {
        "id" : 879,
        "name" : "Validate Guest User",
        "scenarios" : [ {
          "id" : 1642,
          "name" : "Validate Guest User Place Order",
          "steps" : [ {
            "id" : 7327,
            "name" : "Validate messages for order placing"
          }, {
            "id" : 7328,
            "name" : "Validate Guest user uses same address for billing and shipping purposes - IN Validate messages for o"
          }, {
            "id" : 7329,
            "name" : "Validate Guest user uses a different address for billing and shipping purposes"
          }, {
            "id" : 7330,
            "name" : "Validate Guest user edits a shipping address"
          }, {
            "id" : 7331,
            "name" : "Validate Guest user edits a billing address F"
          }, {
            "id" : 7332,
            "name" : "Validate Guest user adds a new shipping address - IN PREVIOUS CASES"
          }, {
            "id" : 7333,
            "name" : "Validate Guest user adds a new billing address - IN PREVIOUS CASES"
          } ]
        } ]
      }, {
        "id" : 880,
        "name" : "Validate Registered User",
        "scenarios" : [ {
          "id" : 1643,
          "name" : "Validate A Registered Favorite List And Wish List Department",
          "steps" : [ {
            "id" : 7334,
            "name" : "Validate Add Wish List Article"
          }, {
            "id" : 7335,
            "name" : "Validate Share Favorite List"
          }, {
            "id" : 7336,
            "name" : "Validate Delete Wish List Article"
          }, {
            "id" : 7337,
            "name" : "Validate Empty Favorite List"
          }, {
            "id" : 7338,
            "name" : "Validate Account Side Menu Anglais"
          }, {
            "id" : 7339,
            "name" : "Validate Item Out Of Stock"
          }, {
            "id" : 7340,
            "name" : "Validate Wish List"
          }, {
            "id" : 7341,
            "name" : "Validate Minimum Order (150$ - QA) - NOT VALID IN STAGE"
          }, {
            "id" : 7342,
            "name" : "Validate Modify Case Quantity"
          }, {
            "id" : 7343,
            "name" : "Validate Checkout"
          }, {
            "id" : 7344,
            "name" : "Validate Add New Address for Checkout"
          } ]
        } ]
      }, {
        "id" : 881,
        "name" : "Validate AVS Response codes",
        "scenarios" : [ {
          "id" : 1644,
          "name" : "AVS test Declined Cards",
          "steps" : [ {
            "id" : 7345,
            "name" : "Login"
          }, {
            "id" : 7346,
            "name" : "Go to Order Now page and fill in partial card information"
          }, {
            "id" : 7347,
            "name" : "4761739012345611 G International Card Detected"
          }, {
            "id" : 7348,
            "name" : "4761739012345629 I Address Verification Error The billing address was not verified with the card i"
          }, {
            "id" : 7349,
            "name" : "4761739012345645 N Address Verification Error The billing address and postal code do not match"
          }, {
            "id" : 7350,
            "name" : "4761739012345660 R Address Verification Error The billing address was not verified with the card iss"
          }, {
            "id" : 7351,
            "name" : "4761739012345694 C Address Verification Error Please ensure the billing address is correct or contac"
          }, {
            "id" : 7352,
            "name" : "4761739012345652 P Address Verification Error Please ensure the billing address is correct o"
          }, {
            "id" : 7353,
            "name" : "4761739012345728 Z Address Verification Error Please ensure the billing address is correct o"
          }, {
            "id" : 7354,
            "name" : "4761739012345678 A Address Verification Error Please ensure the billing postal code is correct or co"
          }, {
            "id" : 7355,
            "name" : "4761739012345686 B Address Verification Error Please ensure the billing postal code is corre"
          }, {
            "id" : 7356,
            "name" : "4761739012345751 S Address Verification Error Billing address verification is required"
          }, {
            "id" : 7357,
            "name" : "4761739012345744 U Address Verification Error Billing address verification is required"
          } ]
        } ]
      }, {
        "id" : 882,
        "name" : "Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 1645,
          "name" : "Close Browser UnMap And Delete Directories",
          "steps" : [ {
            "id" : 7358,
            "name" : "Login information"
          }, {
            "id" : 7359,
            "name" : "Un Map and Delete The Directory"
          }, {
            "id" : 7360,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 142,
      "name" : "03-DWS Mobile Tablet Android (Shopping and Checkout Chrome EN)(Bujor)",
      "functionalities" : [ {
        "id" : 859,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 1610,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 7211,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 7212,
            "name" : "Login Info"
          } ]
        }, {
          "id" : 1611,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 7213,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 7214,
            "name" : "Logging of Setting Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 1612,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 7215,
            "name" : "Open Browser With Type Of Browser And Selenium Hub"
          }, {
            "id" : 7216,
            "name" : "Open Browser With Type Of Browser And Selenium Hub (Bujor)"
          }, {
            "id" : 7217,
            "name" : "Log Information"
          } ]
        } ]
      }, {
        "id" : 860,
        "name" : "Set Language English",
        "scenarios" : [ {
          "id" : 1613,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 7218,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 861,
        "name" : "Validate An Anonymous Action",
        "scenarios" : [ {
          "id" : 1614,
          "name" : "Validate Favorite",
          "steps" : [ {
            "id" : 7219,
            "name" : "Validate Favorite Header"
          }, {
            "id" : 7220,
            "name" : "Validate Adding an article to Wish list from Department Page"
          }, {
            "id" : 7221,
            "name" : "Validate Adding an article to Wish list from You may also like on Article Page"
          }, {
            "id" : 7222,
            "name" : "Validate Adding an article to Wish list from Search Results Page"
          }, {
            "id" : 7223,
            "name" : "Validate Adding an article to Wish list from Article Page"
          } ]
        } ]
      }, {
        "id" : 862,
        "name" : "Validate Guest User",
        "scenarios" : [ {
          "id" : 1615,
          "name" : "Validate Guest User Place Order",
          "steps" : [ {
            "id" : 7224,
            "name" : "Validate messages for order placing"
          }, {
            "id" : 7225,
            "name" : "Validate Guest user uses same address for billing and shipping purposes - IN Validate messages for o"
          }, {
            "id" : 7226,
            "name" : "Validate Guest user uses a different address for billing and shipping purposes"
          }, {
            "id" : 7227,
            "name" : "Validate Guest user edits a shipping address"
          }, {
            "id" : 7228,
            "name" : "Validate Guest user edits a billing address F"
          }, {
            "id" : 7229,
            "name" : "Validate Guest user adds a new shipping address - IN PREVIOUS CASES"
          }, {
            "id" : 7230,
            "name" : "Validate Guest user adds a new billing address - IN PREVIOUS CASES"
          } ]
        } ]
      }, {
        "id" : 863,
        "name" : "Validate Registered User",
        "scenarios" : [ {
          "id" : 1616,
          "name" : "Validate A Registered Favorite List And Wish List Department",
          "steps" : [ {
            "id" : 7231,
            "name" : "Validate Add Wish List Article"
          }, {
            "id" : 7232,
            "name" : "Validate Share Favorite List"
          }, {
            "id" : 7233,
            "name" : "Validate Delete Wish List Article"
          }, {
            "id" : 7234,
            "name" : "Validate Empty Favorite List"
          }, {
            "id" : 7235,
            "name" : "Validate Account Side Menu Anglais"
          }, {
            "id" : 7236,
            "name" : "Validate Item Out Of Stock"
          }, {
            "id" : 7237,
            "name" : "Validate Wish List"
          }, {
            "id" : 7238,
            "name" : "Validate Minimum Order (150$ - QA) - NOT VALID IN STAGE"
          }, {
            "id" : 7239,
            "name" : "Validate Modify Case Quantity"
          }, {
            "id" : 7240,
            "name" : "Validate Checkout"
          }, {
            "id" : 7241,
            "name" : "Validate Add New Address for Checkout"
          } ]
        } ]
      }, {
        "id" : 864,
        "name" : "Validate AVS Response codes",
        "scenarios" : [ {
          "id" : 1617,
          "name" : "AVS test Declined Cards",
          "steps" : [ {
            "id" : 7242,
            "name" : "Login"
          }, {
            "id" : 7243,
            "name" : "Go to Order Now page and fill in partial card information"
          }, {
            "id" : 7244,
            "name" : "4761739012345611 G International Card Detected"
          }, {
            "id" : 7245,
            "name" : "4761739012345629 I Address Verification Error The billing address was not verified with the card i"
          }, {
            "id" : 7246,
            "name" : "4761739012345645 N Address Verification Error The billing address and postal code do not match"
          }, {
            "id" : 7247,
            "name" : "4761739012345660 R Address Verification Error The billing address was not verified with the card iss"
          }, {
            "id" : 7248,
            "name" : "4761739012345694 C Address Verification Error Please ensure the billing address is correct or contac"
          }, {
            "id" : 7249,
            "name" : "4761739012345652 P Address Verification Error Please ensure the billing address is correct o"
          }, {
            "id" : 7250,
            "name" : "4761739012345728 Z Address Verification Error Please ensure the billing address is correct o"
          }, {
            "id" : 7251,
            "name" : "4761739012345678 A Address Verification Error Please ensure the billing postal code is correct or co"
          }, {
            "id" : 7252,
            "name" : "4761739012345686 B Address Verification Error Please ensure the billing postal code is corre"
          }, {
            "id" : 7253,
            "name" : "4761739012345751 S Address Verification Error Billing address verification is required"
          }, {
            "id" : 7254,
            "name" : "4761739012345744 U Address Verification Error Billing address verification is required"
          } ]
        } ]
      }, {
        "id" : 865,
        "name" : "Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 1618,
          "name" : "Close Browser UnMap And Delete Directories",
          "steps" : [ {
            "id" : 7255,
            "name" : "Login information"
          }, {
            "id" : 7256,
            "name" : "Un Map and Delete The Directory"
          }, {
            "id" : 7257,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 129,
      "name" : "copi01-DWS Mobile Phone Android (Product Catalog Chrome EN) Amira sauvgard",
      "functionalities" : [ {
        "id" : 792,
        "name" : "01_Setting Of Selenium, Browser And Variables",
        "scenarios" : [ {
          "id" : 1472,
          "name" : "01_Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 6645,
            "name" : "01_Setting Variables (Data Repository)"
          }, {
            "id" : 6646,
            "name" : "02_Log for Data Repository"
          } ]
        }, {
          "id" : 1473,
          "name" : "03_Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 6647,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub Physique"
          }, {
            "id" : 6648,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub Simulator"
          }, {
            "id" : 6649,
            "name" : "02_Log When Browser is opened"
          } ]
        } ]
      }, {
        "id" : 793,
        "name" : "02_Set Language English",
        "scenarios" : [ {
          "id" : 1474,
          "name" : "01_Set Language English",
          "steps" : [ {
            "id" : 6650,
            "name" : "01_Set Language English"
          } ]
        } ]
      }, {
        "id" : 794,
        "name" : "03_Validate Content validation and Browse articles from home page",
        "scenarios" : [ {
          "id" : 1475,
          "name" : "01_Validate Home Page",
          "steps" : [ {
            "id" : 6651,
            "name" : "01_Validate Sticky header"
          }, {
            "id" : 6652,
            "name" : "02_Validate Start shopping Button on Banner and the Shop now"
          } ]
        }, {
          "id" : 1476,
          "name" : "02_Validate Header",
          "steps" : [ {
            "id" : 6653,
            "name" : "01_Validate Top Middle - Header"
          }, {
            "id" : 6654,
            "name" : "02_Validate Low - Header"
          } ]
        } ]
      }, {
        "id" : 795,
        "name" : "04_Validate Shop By Activity and Department - menu & sub-menu items",
        "scenarios" : [ {
          "id" : 1477,
          "name" : "TestLogin",
          "steps" : [ {
            "id" : 6655,
            "name" : "Test Login"
          } ]
        }, {
          "id" : 1478,
          "name" : "01_Validate All menu and sub-menu for Departments",
          "steps" : [ {
            "id" : 6656,
            "name" : "Validate Sub-menu for Cleaning"
          }, {
            "id" : 6657,
            "name" : "Validate Sub-menu for Clothing"
          }, {
            "id" : 6658,
            "name" : "Validate Sub-menu for Electronics"
          }, {
            "id" : 6659,
            "name" : "Validate Sub-menu for Food"
          }, {
            "id" : 6660,
            "name" : "Validate Sub-menu for Hardware"
          }, {
            "id" : 6661,
            "name" : "Validate Sub-menu for Health & Beauty"
          }, {
            "id" : 6662,
            "name" : "Validate Sub-menu for Home Decor"
          }, {
            "id" : 6663,
            "name" : "Validate Sub-menu for Kitchen--"
          }, {
            "id" : 6664,
            "name" : "Validate Sub-menu for Office"
          }, {
            "id" : 6665,
            "name" : "Validate Sub-menu for Party--"
          }, {
            "id" : 6666,
            "name" : "Validate Sub-menu for Pets--"
          }, {
            "id" : 6667,
            "name" : "Validate Sub-menu for Toys"
          }, {
            "id" : 6668,
            "name" : "Copie de Validate Sub-menu for Cleaning-Menu complet-"
          } ]
        }, {
          "id" : 1479,
          "name" : "02_Validate All Menu and sub-menu Activity",
          "steps" : [ {
            "id" : 6669,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels"
          }, {
            "id" : 6670,
            "name" : "Validate Sub-menu Event, Party & Wedding Planning"
          }, {
            "id" : 6671,
            "name" : "Validate Sub-menu Hospital & Care Facilities"
          }, {
            "id" : 6672,
            "name" : "Validate Sub-menu Maintenance"
          }, {
            "id" : 6673,
            "name" : "Validate Sub-menu Offices"
          }, {
            "id" : 6674,
            "name" : "Validate Sub-menu Schools"
          }, {
            "id" : 6675,
            "name" : "Copie de Validate Sub-menu Catering, Restaurants & Hotels(menu complet)"
          }, {
            "id" : 6676,
            "name" : "Copie de Validate Sub-menu Hospital & Care Facilities(Menu complet)"
          }, {
            "id" : 6677,
            "name" : "Copie de Validate Sub-menu Offices(menu complet)"
          }, {
            "id" : 6678,
            "name" : "Copie de Validate Sub-menu Schools(Menu complet)"
          } ]
        }, {
          "id" : 1480,
          "name" : "Copie de 02_Validate All Menu and sub-menu Activity Sauvegarde",
          "steps" : [ {
            "id" : 6679,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels"
          }, {
            "id" : 6680,
            "name" : "Validate Sub-menu Event, Party & Wedding Planning"
          }, {
            "id" : 6681,
            "name" : "Validate Sub-menu Hospital & Care Facilities"
          }, {
            "id" : 6682,
            "name" : "Validate Sub-menu Maintenance"
          }, {
            "id" : 6683,
            "name" : "Validate Sub-menu Offices"
          }, {
            "id" : 6684,
            "name" : "Validate Sub-menu Schools"
          }, {
            "id" : 6685,
            "name" : "Copie de Validate Sub-menu Catering, Restaurants & Hotels(menu complet)"
          }, {
            "id" : 6686,
            "name" : "Copie de Validate Sub-menu Hospital & Care Facilities(Menu complet)"
          }, {
            "id" : 6687,
            "name" : "Copie de Validate Sub-menu Offices(menu complet)"
          }, {
            "id" : 6688,
            "name" : "Copie de Validate Sub-menu Schools(Menu complet)"
          } ]
        }, {
          "id" : 1481,
          "name" : "Copie de 01_Validate All menu and sub-menu for Departments sauvegarde",
          "steps" : [ {
            "id" : 6689,
            "name" : "Validate Sub-menu for Cleaning"
          }, {
            "id" : 6690,
            "name" : "Validate Sub-menu for Clothing"
          }, {
            "id" : 6691,
            "name" : "Validate Sub-menu for Electronics"
          }, {
            "id" : 6692,
            "name" : "Validate Sub-menu for Food"
          }, {
            "id" : 6693,
            "name" : "Validate Sub-menu for Hardware"
          }, {
            "id" : 6694,
            "name" : "Validate Sub-menu for Health & Beauty"
          }, {
            "id" : 6695,
            "name" : "Validate Sub-menu for Home Decor"
          }, {
            "id" : 6696,
            "name" : "Validate Sub-menu for Kitchen--"
          }, {
            "id" : 6697,
            "name" : "Validate Sub-menu for Office"
          }, {
            "id" : 6698,
            "name" : "Validate Sub-menu for Party--"
          }, {
            "id" : 6699,
            "name" : "Validate Sub-menu for Pets--"
          }, {
            "id" : 6700,
            "name" : "Validate Sub-menu for Toys"
          }, {
            "id" : 6701,
            "name" : "Copie de Validate Sub-menu for Cleaning-Menu complet-"
          } ]
        } ]
      }, {
        "id" : 796,
        "name" : "05_Validate Filter",
        "scenarios" : [ {
          "id" : 1482,
          "name" : "01_Validate Filter Department",
          "steps" : [ {
            "id" : 6702,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 6703,
            "name" : "02_Validate Filter By Departments"
          }, {
            "id" : 6704,
            "name" : "03_Validate Filter by Business"
          }, {
            "id" : 6705,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 6706,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 6707,
            "name" : "05_Validate Many Filter Same time"
          } ]
        }, {
          "id" : 1483,
          "name" : "02_Validate Filter Activity",
          "steps" : [ {
            "id" : 6708,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 6709,
            "name" : "02_Validate Filter By Departments"
          }, {
            "id" : 6710,
            "name" : "03_Validate Filter by Business"
          }, {
            "id" : 6711,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 6712,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 6713,
            "name" : "05_Validate Many Filter Same time"
          } ]
        }, {
          "id" : 1484,
          "name" : "02_Validate Filter ActivityOLD",
          "steps" : [ {
            "id" : 6714,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 6715,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 6716,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 6717,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 6718,
            "name" : "05_Validate Many Filters Same time"
          } ]
        } ]
      }, {
        "id" : 797,
        "name" : "06_Validate Short",
        "scenarios" : [ {
          "id" : 1485,
          "name" : "01_Validate Short Department",
          "steps" : [ {
            "id" : 6719,
            "name" : "01_Validate Price per case Low to High"
          }, {
            "id" : 6720,
            "name" : "02_Validate Price per case High to Low"
          }, {
            "id" : 6721,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 6722,
            "name" : "04_Validate Name Z to A"
          }, {
            "id" : 6723,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 6724,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        }, {
          "id" : 1486,
          "name" : "02_Validate Short Activity",
          "steps" : [ {
            "id" : 6725,
            "name" : "01_Validate price per Case Low to High"
          }, {
            "id" : 6726,
            "name" : "02_Validate price per Case High to Low"
          }, {
            "id" : 6727,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 6728,
            "name" : "04_Validatre Name Z to A"
          }, {
            "id" : 6729,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 6730,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        } ]
      }, {
        "id" : 798,
        "name" : "07_Validate Article Page Content",
        "scenarios" : [ {
          "id" : 1487,
          "name" : "01_Validate Department Article Page",
          "steps" : [ {
            "id" : 6731,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 6732,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 6733,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 6734,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 6735,
            "name" : "05_Validate Article title"
          }, {
            "id" : 6736,
            "name" : "06_Validate You may also like"
          }, {
            "id" : 6737,
            "name" : "Copy of 03_Validate Add Favorite in article page"
          } ]
        }, {
          "id" : 1488,
          "name" : "02_Validate Activity Article Page",
          "steps" : [ {
            "id" : 6738,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 6739,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 6740,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 6741,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 6742,
            "name" : "05_Validate Article title"
          }, {
            "id" : 6743,
            "name" : "06_Validate You may also like"
          } ]
        } ]
      }, {
        "id" : 799,
        "name" : "08_Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 1489,
          "name" : "01_UnMap And Delete Directory",
          "steps" : [ {
            "id" : 6744,
            "name" : "01_Log To UnMap"
          }, {
            "id" : 6745,
            "name" : "02_Un Map and Delete The Directory On Server And Virtual Machine"
          } ]
        }, {
          "id" : 1490,
          "name" : "02_Close browser",
          "steps" : [ {
            "id" : 6746,
            "name" : "01_Logging of the Teardown"
          }, {
            "id" : 6747,
            "name" : "02_Close Application Mobile"
          } ]
        } ]
      }, {
        "id" : 800,
        "name" : "Copie de 05_Validate Filter",
        "scenarios" : [ {
          "id" : 1491,
          "name" : "01_Validate Filter Department",
          "steps" : [ {
            "id" : 6748,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 6749,
            "name" : "02_Validate Filter By Departments"
          }, {
            "id" : 6750,
            "name" : "03_Validate Filter by Business"
          }, {
            "id" : 6751,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 6752,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 6753,
            "name" : "05_Validate Many Filter Same time"
          } ]
        }, {
          "id" : 1492,
          "name" : "02_Validate Filter Activity",
          "steps" : [ {
            "id" : 6754,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 6755,
            "name" : "02_Validate Filter By Departments"
          }, {
            "id" : 6756,
            "name" : "03_Validate Filter by Business"
          }, {
            "id" : 6757,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 6758,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 6759,
            "name" : "05_Validate Many Filter Same time"
          } ]
        }, {
          "id" : 1493,
          "name" : "02_Validate Filter ActivityOLD",
          "steps" : [ {
            "id" : 6760,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 6761,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 6762,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 6763,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 6764,
            "name" : "05_Validate Many Filters Same time"
          } ]
        } ]
      } ]
    }, {
      "id" : 126,
      "name" : "02_DWS (Desktop My Account FireFox FR) (Final)",
      "functionalities" : [ {
        "id" : 779,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 1444,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 6545,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 6546,
            "name" : "Log Setting Variables (Data Repository)"
          } ]
        }, {
          "id" : 1445,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 6547,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 6548,
            "name" : "Log Of Setting Selenium Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 1446,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 6549,
            "name" : "Setting The Opening Of Browser With Selenium Hub"
          } ]
        } ]
      }, {
        "id" : 780,
        "name" : "Set Language English",
        "scenarios" : [ {
          "id" : 1447,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 6550,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 781,
        "name" : "Validate My Account",
        "scenarios" : [ {
          "id" : 1448,
          "name" : "Validate Login Functions",
          "steps" : [ {
            "id" : 6551,
            "name" : "Validate Login Logout"
          }, {
            "id" : 6552,
            "name" : "Validate Login Forgot Password"
          } ]
        }, {
          "id" : 1449,
          "name" : "Validate User",
          "steps" : [ {
            "id" : 6553,
            "name" : "Validate User Creation"
          }, {
            "id" : 6554,
            "name" : "Validate User Address Creation"
          } ]
        }, {
          "id" : 1450,
          "name" : "Validate Page Account",
          "steps" : [ {
            "id" : 6555,
            "name" : "Validate Create Blank Account"
          }, {
            "id" : 6556,
            "name" : "Validate Create Account With Invalid Data"
          }, {
            "id" : 6557,
            "name" : "Validate User Register Account Invalid Password"
          }, {
            "id" : 6558,
            "name" : "Validate User Register Account Different Password"
          }, {
            "id" : 6559,
            "name" : "Validate Logged User Shopping Cart Remember"
          }, {
            "id" : 6767,
            "name" : "Validate Modify Account And information English"
          }, {
            "id" : 6766,
            "name" : "Validate Modify Account And information French"
          }, {
            "id" : 6562,
            "name" : "Validate information into Login page"
          }, {
            "id" : 6563,
            "name" : "Validate Stay in checkbox"
          }, {
            "id" : 6564,
            "name" : "Validate Forgot password xxx(Inclu dans Validate Login Functions) xxx"
          }, {
            "id" : 6765,
            "name" : "Copy of Validate Modify Account And information French"
          }, {
            "id" : 6560,
            "name" : "Validate Modify Account And information EnglishOld"
          } ]
        } ]
      }, {
        "id" : 782,
        "name" : "Close Browser",
        "scenarios" : [ {
          "id" : 1451,
          "name" : "Close Browser",
          "steps" : [ {
            "id" : 6565,
            "name" : "Log Of Closing Browser"
          }, {
            "id" : 6566,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 144,
      "name" : "Final_02-DWS Mobile Tablette Android (Account Chrome FR) (Edmond_Tablette)",
      "functionalities" : [ {
        "id" : 871,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 1628,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 7286,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 7287,
            "name" : "Log Setting Variables (Data Repository)"
          } ]
        }, {
          "id" : 1629,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 7288,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 7289,
            "name" : "Log Of Setting Selenium Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 1630,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 7290,
            "name" : "Setting The Opening Of Browser With Selenium Hub houcine"
          }, {
            "id" : 7291,
            "name" : "Setting The Opening Of Browser With Selenium Hub"
          } ]
        } ]
      }, {
        "id" : 872,
        "name" : "Set Language English",
        "scenarios" : [ {
          "id" : 1631,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 7292,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 873,
        "name" : "Copie de Set Language English",
        "scenarios" : [ {
          "id" : 1632,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 7293,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 874,
        "name" : "Validate My Account",
        "scenarios" : [ {
          "id" : 1633,
          "name" : "Validate Login Functions",
          "steps" : [ {
            "id" : 7294,
            "name" : "Validate Login Logout"
          }, {
            "id" : 7295,
            "name" : "Validate Login Forgot Password"
          } ]
        }, {
          "id" : 1634,
          "name" : "Validate User",
          "steps" : [ {
            "id" : 7297,
            "name" : "Final_Validate User Creation"
          }, {
            "id" : 7298,
            "name" : "Validate User Address Creation_brouillon"
          }, {
            "id" : 7299,
            "name" : "Copy of Validate User Address Creation"
          }, {
            "id" : 7300,
            "name" : "Final_Validate User Address Creation"
          } ]
        }, {
          "id" : 1635,
          "name" : "Validate Page Account",
          "steps" : [ {
            "id" : 7301,
            "name" : "Validate Create Blank Account"
          }, {
            "id" : 7302,
            "name" : "Validate Create Account With Invalid Data_edmond"
          }, {
            "id" : 7303,
            "name" : "Validate User Register Account Invalid Password"
          }, {
            "id" : 7304,
            "name" : "Validate User Register Account Different Password"
          }, {
            "id" : 7305,
            "name" : "Validate Modify Account And information French"
          }, {
            "id" : 7306,
            "name" : "Validate Modify Account And information English"
          }, {
            "id" : 7307,
            "name" : "Validate information into Login page"
          }, {
            "id" : 7308,
            "name" : "Copy of Validate Stay in checkbox Test Yves"
          }, {
            "id" : 7309,
            "name" : "Validate Stay in checkbox"
          }, {
            "id" : 7310,
            "name" : "Validate Logged User Shopping Cart Remember"
          }, {
            "id" : 7311,
            "name" : "Validate Forgot password xxx(Inclu dans Validate Login Functions) xxx"
          } ]
        } ]
      }, {
        "id" : 875,
        "name" : "Close Browser",
        "scenarios" : [ {
          "id" : 1636,
          "name" : "Close Browser",
          "steps" : [ {
            "id" : 7312,
            "name" : "Log Of Closing Browser"
          }, {
            "id" : 7313,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 131,
      "name" : "02_DWS (Desktop My Account Chrome FR) (Final)",
      "functionalities" : [ {
        "id" : 805,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 1502,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 6790,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 6791,
            "name" : "Log Setting Variables (Data Repository)"
          } ]
        }, {
          "id" : 1503,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 6792,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 6793,
            "name" : "Log Of Setting Selenium Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 1504,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 6794,
            "name" : "Setting The Opening Of Browser With Selenium Hub"
          } ]
        } ]
      }, {
        "id" : 806,
        "name" : "Set Language English",
        "scenarios" : [ {
          "id" : 1505,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 6795,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 807,
        "name" : "Validate My Account",
        "scenarios" : [ {
          "id" : 1506,
          "name" : "Validate Login Functions",
          "steps" : [ {
            "id" : 6796,
            "name" : "Validate Login Logout"
          }, {
            "id" : 6797,
            "name" : "Validate Login Forgot Password"
          } ]
        }, {
          "id" : 1507,
          "name" : "Validate User",
          "steps" : [ {
            "id" : 6798,
            "name" : "Validate User Creation"
          }, {
            "id" : 6799,
            "name" : "Validate User Address Creation"
          } ]
        }, {
          "id" : 1508,
          "name" : "Validate Page Account",
          "steps" : [ {
            "id" : 6800,
            "name" : "Validate Create Blank Account"
          }, {
            "id" : 6801,
            "name" : "Validate Create Account With Invalid Data"
          }, {
            "id" : 6802,
            "name" : "Validate User Register Account Invalid Password"
          }, {
            "id" : 6803,
            "name" : "Validate User Register Account Different Password"
          }, {
            "id" : 6804,
            "name" : "Validate Logged User Shopping Cart Remember"
          }, {
            "id" : 6805,
            "name" : "Validate Modify Account And information English"
          }, {
            "id" : 6806,
            "name" : "Validate Modify Account And information French"
          }, {
            "id" : 6807,
            "name" : "Validate information into Login page"
          }, {
            "id" : 6808,
            "name" : "Validate Stay in checkbox"
          }, {
            "id" : 6809,
            "name" : "Validate Forgot password xxx(Inclu dans Validate Login Functions) xxx"
          }, {
            "id" : 6810,
            "name" : "Copy of Validate Modify Account And information French"
          }, {
            "id" : 6811,
            "name" : "Validate Modify Account And information EnglishOld"
          } ]
        } ]
      }, {
        "id" : 808,
        "name" : "Close Browser",
        "scenarios" : [ {
          "id" : 1509,
          "name" : "Close Browser",
          "steps" : [ {
            "id" : 6812,
            "name" : "Log Of Closing Browser"
          }, {
            "id" : 6813,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 146,
      "name" : "Final_02-DWS Mobile Phone Android (Account Chrome FR) (Edmond)",
      "functionalities" : [ {
        "id" : 883,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 1646,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 7362,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 7363,
            "name" : "Log Setting Variables (Data Repository)"
          } ]
        }, {
          "id" : 1647,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 7364,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 7365,
            "name" : "Log Of Setting Selenium Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 1648,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 7366,
            "name" : "Setting The Opening Of Browser With Selenium Hub houcine"
          }, {
            "id" : 7367,
            "name" : "Setting The Opening Of Browser With Selenium Hub"
          } ]
        } ]
      }, {
        "id" : 884,
        "name" : "Set Language English",
        "scenarios" : [ {
          "id" : 1649,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 7368,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 885,
        "name" : "Copie de Set Language English",
        "scenarios" : [ {
          "id" : 1650,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 7369,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 886,
        "name" : "Validate My Account",
        "scenarios" : [ {
          "id" : 1651,
          "name" : "Validate Login Functions",
          "steps" : [ {
            "id" : 7370,
            "name" : "Validate Login Logout"
          }, {
            "id" : 7371,
            "name" : "Validate Login Forgot Password"
          } ]
        }, {
          "id" : 1652,
          "name" : "Validate User",
          "steps" : [ {
            "id" : 7373,
            "name" : "Final_Validate User Creation"
          }, {
            "id" : 7374,
            "name" : "Validate User Address Creation_brouillon"
          }, {
            "id" : 7375,
            "name" : "Copy of Validate User Address Creation"
          }, {
            "id" : 7376,
            "name" : "Final_Validate User Address Creation"
          } ]
        }, {
          "id" : 1653,
          "name" : "Validate Page Account",
          "steps" : [ {
            "id" : 7377,
            "name" : "Validate Create Blank Account"
          }, {
            "id" : 7378,
            "name" : "Validate Create Account With Invalid Data_edmond"
          }, {
            "id" : 7379,
            "name" : "Validate User Register Account Invalid Password"
          }, {
            "id" : 7380,
            "name" : "Validate User Register Account Different Password"
          }, {
            "id" : 7381,
            "name" : "Validate Modify Account And information French"
          }, {
            "id" : 7382,
            "name" : "Validate Modify Account And information English"
          }, {
            "id" : 7383,
            "name" : "Validate information into Login page"
          }, {
            "id" : 7384,
            "name" : "Copy of Validate Stay in checkbox Test Yves"
          }, {
            "id" : 7385,
            "name" : "Validate Stay in checkbox"
          }, {
            "id" : 7386,
            "name" : "Validate Logged User Shopping Cart Remember"
          }, {
            "id" : 7387,
            "name" : "Validate Forgot password xxx(Inclu dans Validate Login Functions) xxx"
          } ]
        } ]
      }, {
        "id" : 887,
        "name" : "Close Browser",
        "scenarios" : [ {
          "id" : 1654,
          "name" : "Close Browser",
          "steps" : [ {
            "id" : 7388,
            "name" : "Log Of Closing Browser"
          }, {
            "id" : 7389,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 134,
      "name" : "02_DWS (Desktop My Account Chrome EN) (Final)",
      "functionalities" : [ {
        "id" : 818,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 1527,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 6863,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 6864,
            "name" : "Log Setting Variables (Data Repository)"
          } ]
        }, {
          "id" : 1528,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 6865,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 6866,
            "name" : "Log Of Setting Selenium Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 1529,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 6867,
            "name" : "Setting The Opening Of Browser With Selenium Hub"
          } ]
        } ]
      }, {
        "id" : 819,
        "name" : "Set Language English",
        "scenarios" : [ {
          "id" : 1530,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 6868,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 820,
        "name" : "Validate My Account",
        "scenarios" : [ {
          "id" : 1531,
          "name" : "Validate Login Functions",
          "steps" : [ {
            "id" : 6869,
            "name" : "Validate Login Logout"
          }, {
            "id" : 6870,
            "name" : "Validate Login Forgot Password"
          } ]
        }, {
          "id" : 1532,
          "name" : "Validate User",
          "steps" : [ {
            "id" : 6871,
            "name" : "Validate User Creation"
          }, {
            "id" : 6872,
            "name" : "Validate User Address Creation"
          } ]
        }, {
          "id" : 1533,
          "name" : "Validate Page Account",
          "steps" : [ {
            "id" : 6873,
            "name" : "Validate Create Blank Account"
          }, {
            "id" : 6874,
            "name" : "Validate Create Account With Invalid Data"
          }, {
            "id" : 6875,
            "name" : "Validate User Register Account Invalid Password"
          }, {
            "id" : 6876,
            "name" : "Validate User Register Account Different Password"
          }, {
            "id" : 6877,
            "name" : "Validate Logged User Shopping Cart Remember"
          }, {
            "id" : 6878,
            "name" : "Validate Modify Account And information English"
          }, {
            "id" : 6879,
            "name" : "Validate Modify Account And information French"
          }, {
            "id" : 6880,
            "name" : "Validate information into Login page"
          }, {
            "id" : 6881,
            "name" : "Validate Stay in checkbox"
          }, {
            "id" : 6882,
            "name" : "Validate Forgot password xxx(Inclu dans Validate Login Functions) xxx"
          }, {
            "id" : 6883,
            "name" : "Copy of Validate Modify Account And information French"
          }, {
            "id" : 6884,
            "name" : "Validate Modify Account And information EnglishOld"
          } ]
        } ]
      }, {
        "id" : 821,
        "name" : "Close Browser",
        "scenarios" : [ {
          "id" : 1534,
          "name" : "Close Browser",
          "steps" : [ {
            "id" : 6885,
            "name" : "Log Of Closing Browser"
          }, {
            "id" : 6886,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 135,
      "name" : "02_DWS (Desktop My Account IE FR) (Final)",
      "functionalities" : [ {
        "id" : 822,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 1535,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 6888,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 6889,
            "name" : "Log Setting Variables (Data Repository)"
          } ]
        }, {
          "id" : 1536,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 6890,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 6891,
            "name" : "Log Of Setting Selenium Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 1537,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 6892,
            "name" : "Setting The Opening Of Browser With Selenium Hub"
          } ]
        } ]
      }, {
        "id" : 823,
        "name" : "Set Language English",
        "scenarios" : [ {
          "id" : 1538,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 6893,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 824,
        "name" : "Validate My Account",
        "scenarios" : [ {
          "id" : 1539,
          "name" : "Validate Login Functions",
          "steps" : [ {
            "id" : 6894,
            "name" : "Validate Login Logout"
          }, {
            "id" : 6895,
            "name" : "Validate Login Forgot Password"
          } ]
        }, {
          "id" : 1540,
          "name" : "Validate User",
          "steps" : [ {
            "id" : 6896,
            "name" : "Validate User Creation"
          }, {
            "id" : 6897,
            "name" : "Validate User Address Creation"
          } ]
        }, {
          "id" : 1541,
          "name" : "Validate Page Account",
          "steps" : [ {
            "id" : 6898,
            "name" : "Validate Create Blank Account"
          }, {
            "id" : 6899,
            "name" : "Validate Create Account With Invalid Data"
          }, {
            "id" : 6900,
            "name" : "Validate User Register Account Invalid Password"
          }, {
            "id" : 6901,
            "name" : "Validate User Register Account Different Password"
          }, {
            "id" : 6902,
            "name" : "Validate Logged User Shopping Cart Remember"
          }, {
            "id" : 6903,
            "name" : "Validate Modify Account And information English"
          }, {
            "id" : 6904,
            "name" : "Validate Modify Account And information French"
          }, {
            "id" : 6905,
            "name" : "Validate information into Login page"
          }, {
            "id" : 6906,
            "name" : "Validate Stay in checkbox"
          }, {
            "id" : 6907,
            "name" : "Validate Forgot password xxx(Inclu dans Validate Login Functions) xxx"
          }, {
            "id" : 6908,
            "name" : "Copy of Validate Modify Account And information French"
          }, {
            "id" : 6909,
            "name" : "Validate Modify Account And information EnglishOld"
          } ]
        } ]
      }, {
        "id" : 825,
        "name" : "Close Browser",
        "scenarios" : [ {
          "id" : 1542,
          "name" : "Close Browser",
          "steps" : [ {
            "id" : 6910,
            "name" : "Log Of Closing Browser"
          }, {
            "id" : 6911,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 132,
      "name" : "02_DWS (Desktop My Account FireFox EN) (Final)",
      "functionalities" : [ {
        "id" : 809,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 1510,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 6814,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 6815,
            "name" : "Log Setting Variables (Data Repository)"
          } ]
        }, {
          "id" : 1511,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 6816,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 6817,
            "name" : "Log Of Setting Selenium Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 1512,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 6818,
            "name" : "Setting The Opening Of Browser With Selenium Hub"
          } ]
        } ]
      }, {
        "id" : 810,
        "name" : "Set Language English",
        "scenarios" : [ {
          "id" : 1513,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 6819,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 811,
        "name" : "Validate My Account",
        "scenarios" : [ {
          "id" : 1514,
          "name" : "Validate Login Functions",
          "steps" : [ {
            "id" : 6820,
            "name" : "Validate Login Logout"
          }, {
            "id" : 6821,
            "name" : "Validate Login Forgot Password"
          } ]
        }, {
          "id" : 1515,
          "name" : "Validate User",
          "steps" : [ {
            "id" : 6822,
            "name" : "Validate User Creation"
          }, {
            "id" : 6823,
            "name" : "Validate User Address Creation"
          } ]
        }, {
          "id" : 1516,
          "name" : "Validate Page Account",
          "steps" : [ {
            "id" : 6824,
            "name" : "Validate Create Blank Account"
          }, {
            "id" : 6825,
            "name" : "Validate Create Account With Invalid Data"
          }, {
            "id" : 6826,
            "name" : "Validate User Register Account Invalid Password"
          }, {
            "id" : 6827,
            "name" : "Validate User Register Account Different Password"
          }, {
            "id" : 6828,
            "name" : "Validate Logged User Shopping Cart Remember"
          }, {
            "id" : 6829,
            "name" : "Validate Modify Account And information English"
          }, {
            "id" : 6830,
            "name" : "Validate Modify Account And information French"
          }, {
            "id" : 6831,
            "name" : "Validate information into Login page"
          }, {
            "id" : 6832,
            "name" : "Validate Stay in checkbox"
          }, {
            "id" : 6833,
            "name" : "Validate Forgot password xxx(Inclu dans Validate Login Functions) xxx"
          }, {
            "id" : 6834,
            "name" : "Copy of Validate Modify Account And information French"
          }, {
            "id" : 6835,
            "name" : "Validate Modify Account And information EnglishOld"
          } ]
        } ]
      }, {
        "id" : 812,
        "name" : "Close Browser",
        "scenarios" : [ {
          "id" : 1517,
          "name" : "Close Browser",
          "steps" : [ {
            "id" : 6836,
            "name" : "Log Of Closing Browser"
          }, {
            "id" : 6837,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 125,
      "name" : "99_DWS (Desktop My Account IE EN) (Test Yves)",
      "functionalities" : [ {
        "id" : 774,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 1435,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 6520,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 6521,
            "name" : "Log Setting Variables (Data Repository)"
          } ]
        }, {
          "id" : 1436,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 6522,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 6523,
            "name" : "Log Of Setting Selenium Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 1437,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 6524,
            "name" : "Setting The Opening Of Browser With Selenium Hub"
          } ]
        } ]
      }, {
        "id" : 775,
        "name" : "Set Language English",
        "scenarios" : [ {
          "id" : 1438,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 6525,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 776,
        "name" : "Copie de Set Language English",
        "scenarios" : [ {
          "id" : 1439,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 6526,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 777,
        "name" : "Validate My Account",
        "scenarios" : [ {
          "id" : 1440,
          "name" : "Validate Login Functions",
          "steps" : [ {
            "id" : 6527,
            "name" : "Validate Login Logout"
          }, {
            "id" : 6528,
            "name" : "Validate Login Forgot Password"
          } ]
        }, {
          "id" : 1441,
          "name" : "Validate User",
          "steps" : [ {
            "id" : 6529,
            "name" : "Validate User Creation"
          }, {
            "id" : 6530,
            "name" : "Validate User Address Creation"
          } ]
        }, {
          "id" : 1442,
          "name" : "Validate Page Account",
          "steps" : [ {
            "id" : 6531,
            "name" : "Validate Create Blank Account"
          }, {
            "id" : 6532,
            "name" : "Validate Create Account With Invalid Data"
          }, {
            "id" : 6533,
            "name" : "Validate User Register Account Invalid Password"
          }, {
            "id" : 6534,
            "name" : "Validate User Register Account Different Password"
          }, {
            "id" : 6535,
            "name" : "Validate Logged User Shopping Cart Remember"
          }, {
            "id" : 6536,
            "name" : "Validate Modify Account And information French"
          }, {
            "id" : 6537,
            "name" : "Validate Modify Account And information English"
          }, {
            "id" : 6538,
            "name" : "Validate information into Login page"
          }, {
            "id" : 6539,
            "name" : "Copie de Validate information into Login page"
          }, {
            "id" : 6540,
            "name" : "Copy of Validate Stay in checkbox Test Yves"
          }, {
            "id" : 6541,
            "name" : "Validate Stay in checkbox"
          }, {
            "id" : 6542,
            "name" : "Validate Forgot password xxx(Inclu dans Validate Login Functions) xxx"
          } ]
        } ]
      }, {
        "id" : 778,
        "name" : "Close Browser",
        "scenarios" : [ {
          "id" : 1443,
          "name" : "Close Browser",
          "steps" : [ {
            "id" : 6543,
            "name" : "Log Of Closing Browser"
          }, {
            "id" : 6544,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 136,
      "name" : "Copy of 02_DWS (Desktop My Account IE FR) (Yves)",
      "functionalities" : [ {
        "id" : 826,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 1543,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 6912,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 6913,
            "name" : "Log Setting Variables (Data Repository)"
          } ]
        }, {
          "id" : 1544,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 6914,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 6915,
            "name" : "Log Of Setting Selenium Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 1545,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 6916,
            "name" : "Setting The Opening Of Browser With Selenium Hub"
          } ]
        } ]
      }, {
        "id" : 827,
        "name" : "Set Language English",
        "scenarios" : [ {
          "id" : 1546,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 6917,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 828,
        "name" : "Validate My Account",
        "scenarios" : [ {
          "id" : 1547,
          "name" : "Validate Login Functions",
          "steps" : [ {
            "id" : 6918,
            "name" : "Validate Login Logout"
          }, {
            "id" : 6919,
            "name" : "Validate Login Forgot Password"
          } ]
        }, {
          "id" : 1548,
          "name" : "Validate User",
          "steps" : [ {
            "id" : 6920,
            "name" : "Validate User Creation"
          }, {
            "id" : 6921,
            "name" : "Validate User Address Creation"
          } ]
        }, {
          "id" : 1549,
          "name" : "Validate Page Account",
          "steps" : [ {
            "id" : 6922,
            "name" : "Validate Create Blank Account"
          }, {
            "id" : 6923,
            "name" : "Validate Create Account With Invalid Data"
          }, {
            "id" : 6924,
            "name" : "Validate User Register Account Invalid Password"
          }, {
            "id" : 6925,
            "name" : "Validate User Register Account Different Password"
          }, {
            "id" : 6926,
            "name" : "Validate Logged User Shopping Cart Remember"
          }, {
            "id" : 6927,
            "name" : "Validate Modify Account And information English"
          }, {
            "id" : 6928,
            "name" : "Validate Modify Account And information French"
          }, {
            "id" : 6929,
            "name" : "Validate information into Login page"
          }, {
            "id" : 6930,
            "name" : "Validate Stay in checkbox"
          }, {
            "id" : 6931,
            "name" : "Validate Forgot password xxx(Inclu dans Validate Login Functions) xxx"
          } ]
        } ]
      }, {
        "id" : 829,
        "name" : "Close Browser",
        "scenarios" : [ {
          "id" : 1550,
          "name" : "Close Browser",
          "steps" : [ {
            "id" : 6932,
            "name" : "Log Of Closing Browser"
          }, {
            "id" : 6933,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 133,
      "name" : "99_DWS (Desktop My Account IE EN) (OLD)",
      "functionalities" : [ {
        "id" : 813,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 1518,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 6838,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 6839,
            "name" : "Log Setting Variables (Data Repository)"
          } ]
        }, {
          "id" : 1519,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 6840,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 6841,
            "name" : "Log Of Setting Selenium Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 1520,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 6842,
            "name" : "Setting The Opening Of Browser With Selenium Hub"
          } ]
        } ]
      }, {
        "id" : 814,
        "name" : "Set Language English",
        "scenarios" : [ {
          "id" : 1521,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 6843,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 815,
        "name" : "Copie de Set Language English",
        "scenarios" : [ {
          "id" : 1522,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 6844,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 816,
        "name" : "Validate My Account",
        "scenarios" : [ {
          "id" : 1523,
          "name" : "Validate Login Functions",
          "steps" : [ {
            "id" : 6845,
            "name" : "Validate Login Logout"
          }, {
            "id" : 6846,
            "name" : "Validate Login Forgot Password"
          } ]
        }, {
          "id" : 1524,
          "name" : "Validate User",
          "steps" : [ {
            "id" : 6847,
            "name" : "Validate User Creation"
          }, {
            "id" : 6848,
            "name" : "Validate User Address Creation"
          } ]
        }, {
          "id" : 1525,
          "name" : "Validate Page Account",
          "steps" : [ {
            "id" : 6849,
            "name" : "Validate Create Blank Account"
          }, {
            "id" : 6850,
            "name" : "Validate Create Account With Invalid Data"
          }, {
            "id" : 6851,
            "name" : "Validate User Register Account Invalid Password"
          }, {
            "id" : 6852,
            "name" : "Validate User Register Account Different Password"
          }, {
            "id" : 6853,
            "name" : "Validate Logged User Shopping Cart Remember"
          }, {
            "id" : 6854,
            "name" : "Validate Modify Account And information French"
          }, {
            "id" : 6855,
            "name" : "Validate Modify Account And information English"
          }, {
            "id" : 6856,
            "name" : "Validate information into Login page"
          }, {
            "id" : 6857,
            "name" : "Copie de Validate information into Login page"
          }, {
            "id" : 6858,
            "name" : "Copy of Validate Stay in checkbox Test Yves"
          }, {
            "id" : 6859,
            "name" : "Validate Stay in checkbox"
          }, {
            "id" : 6860,
            "name" : "Validate Forgot password xxx(Inclu dans Validate Login Functions) xxx"
          } ]
        } ]
      }, {
        "id" : 817,
        "name" : "Close Browser",
        "scenarios" : [ {
          "id" : 1526,
          "name" : "Close Browser",
          "steps" : [ {
            "id" : 6861,
            "name" : "Log Of Closing Browser"
          }, {
            "id" : 6862,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    }, {
      "id" : 138,
      "name" : "01-DWS Mobile Tablette Android (Product Catalog Chrome EN) Amira final",
      "functionalities" : [ {
        "id" : 834,
        "name" : "01_Setting Of Selenium, Browser And Variables",
        "scenarios" : [ {
          "id" : 1559,
          "name" : "01_Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 6959,
            "name" : "01_Setting Variables (Data Repository)"
          }, {
            "id" : 6960,
            "name" : "02_Log for Data Repository"
          } ]
        }, {
          "id" : 1560,
          "name" : "03_Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 6961,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub Physique"
          }, {
            "id" : 6962,
            "name" : "01_Open Browser With Type Of Browser And Selenium Hub Simulator"
          }, {
            "id" : 6963,
            "name" : "02_Log When Browser is opened"
          } ]
        } ]
      }, {
        "id" : 835,
        "name" : "02_Set Language English",
        "scenarios" : [ {
          "id" : 1561,
          "name" : "01_Set Language English",
          "steps" : [ {
            "id" : 6964,
            "name" : "01_Set Language English"
          } ]
        } ]
      }, {
        "id" : 836,
        "name" : "03_Validate Content validation and Browse articles from home page",
        "scenarios" : [ {
          "id" : 1562,
          "name" : "01_Validate Home Page",
          "steps" : [ {
            "id" : 6965,
            "name" : "01_Validate Sticky header"
          }, {
            "id" : 6966,
            "name" : "02_Validate Start shopping Button on Banner and the Shop now"
          } ]
        }, {
          "id" : 1563,
          "name" : "02_Validate Header",
          "steps" : [ {
            "id" : 6967,
            "name" : "01_Validate Top Middle - Header"
          }, {
            "id" : 6968,
            "name" : "02_Validate Low - Header"
          } ]
        } ]
      }, {
        "id" : 837,
        "name" : "04_Validate Shop By Activity and Department - menu & sub-menu items",
        "scenarios" : [ {
          "id" : 1565,
          "name" : "01_Validate All menu and sub-menu for Departments",
          "steps" : [ {
            "id" : 6982,
            "name" : "Validate Sub-menu for Cleaning-Menu complet-"
          }, {
            "id" : 6971,
            "name" : "Validate Sub-menu for Clothing"
          }, {
            "id" : 6972,
            "name" : "Validate Sub-menu for Electronics"
          }, {
            "id" : 6973,
            "name" : "Validate Sub-menu for Food"
          }, {
            "id" : 6974,
            "name" : "Validate Sub-menu for Hardware"
          }, {
            "id" : 6975,
            "name" : "Validate Sub-menu for Health & Beauty"
          }, {
            "id" : 6976,
            "name" : "Validate Sub-menu for Home Decor"
          }, {
            "id" : 6977,
            "name" : "Validate Sub-menu for Kitchen--"
          }, {
            "id" : 6978,
            "name" : "Validate Sub-menu for Office"
          }, {
            "id" : 6979,
            "name" : "Validate Sub-menu for Party--"
          }, {
            "id" : 6980,
            "name" : "Validate Sub-menu for Pets--"
          }, {
            "id" : 7361,
            "name" : "Copie de Validate Sub-menu for Toys"
          }, {
            "id" : 6970,
            "name" : "copie Validate Sub-menu for Cleaning"
          }, {
            "id" : 7202,
            "name" : "Validate Sub-menu for Toys"
          } ]
        }, {
          "id" : 1566,
          "name" : "02_Validate All Menu and sub-menu Activity",
          "steps" : [ {
            "id" : 6989,
            "name" : "Copie de Validate Sub-menu Catering, Restaurants & Hotels(menu complet)"
          }, {
            "id" : 6984,
            "name" : "Validate Sub-menu Event, Party & Wedding Planning"
          }, {
            "id" : 6990,
            "name" : "Copie de Validate Sub-menu Hospital & Care Facilities(Menu complet)"
          }, {
            "id" : 6986,
            "name" : "Validate Sub-menu Maintenance"
          }, {
            "id" : 6991,
            "name" : "Copie de Validate Sub-menu Offices(menu complet)"
          }, {
            "id" : 6992,
            "name" : "Copie de Validate Sub-menu Schools(Menu complet)"
          }, {
            "id" : 6988,
            "name" : "Validate Sub-menu Schools"
          }, {
            "id" : 6987,
            "name" : "Validate Sub-menu Offices"
          }, {
            "id" : 6985,
            "name" : "Validate Sub-menu Hospital & Care Facilities"
          }, {
            "id" : 6983,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels"
          } ]
        }, {
          "id" : 1567,
          "name" : "Copie de 02_Validate All Menu and sub-menu Activity Sauvegarde",
          "steps" : [ {
            "id" : 6993,
            "name" : "Validate Sub-menu Catering, Restaurants & Hotels"
          }, {
            "id" : 6994,
            "name" : "Validate Sub-menu Event, Party & Wedding Planning"
          }, {
            "id" : 6995,
            "name" : "Validate Sub-menu Hospital & Care Facilities"
          }, {
            "id" : 6996,
            "name" : "Validate Sub-menu Maintenance"
          }, {
            "id" : 6997,
            "name" : "Validate Sub-menu Offices"
          }, {
            "id" : 6998,
            "name" : "Validate Sub-menu Schools"
          }, {
            "id" : 6999,
            "name" : "Copie de Validate Sub-menu Catering, Restaurants & Hotels(menu complet)"
          }, {
            "id" : 7000,
            "name" : "Copie de Validate Sub-menu Hospital & Care Facilities(Menu complet)"
          }, {
            "id" : 7001,
            "name" : "Copie de Validate Sub-menu Offices(menu complet)"
          }, {
            "id" : 7002,
            "name" : "Copie de Validate Sub-menu Schools(Menu complet)"
          } ]
        }, {
          "id" : 1568,
          "name" : "Copie de 01_Validate All menu and sub-menu for Departments sauvegarde",
          "steps" : [ {
            "id" : 7003,
            "name" : "Validate Sub-menu for Cleaning"
          }, {
            "id" : 7004,
            "name" : "Validate Sub-menu for Clothing"
          }, {
            "id" : 7005,
            "name" : "Validate Sub-menu for Electronics"
          }, {
            "id" : 7006,
            "name" : "Validate Sub-menu for Food"
          }, {
            "id" : 7007,
            "name" : "Validate Sub-menu for Hardware"
          }, {
            "id" : 7008,
            "name" : "Validate Sub-menu for Health & Beauty"
          }, {
            "id" : 7009,
            "name" : "Validate Sub-menu for Home Decor"
          }, {
            "id" : 7010,
            "name" : "Validate Sub-menu for Kitchen--"
          }, {
            "id" : 7011,
            "name" : "Validate Sub-menu for Office"
          }, {
            "id" : 7012,
            "name" : "Validate Sub-menu for Party--"
          }, {
            "id" : 7013,
            "name" : "Validate Sub-menu for Pets--"
          }, {
            "id" : 7014,
            "name" : "Validate Sub-menu for Toys"
          }, {
            "id" : 7015,
            "name" : "Copie de Validate Sub-menu for Cleaning-Menu complet-"
          } ]
        } ]
      }, {
        "id" : 838,
        "name" : "05_Validate Filter",
        "scenarios" : [ {
          "id" : 1569,
          "name" : "01_Validate Filter Department",
          "steps" : [ {
            "id" : 7016,
            "name" : "01_Validate See More And Less--"
          }, {
            "id" : 7017,
            "name" : "02_Validate Filter By Departments"
          }, {
            "id" : 7018,
            "name" : "03_Validate Filter by Activities--"
          }, {
            "id" : 7019,
            "name" : "04_Validate Filter by Brand"
          }, {
            "id" : 7020,
            "name" : "05_Validate Filter by Unit Price"
          }, {
            "id" : 7021,
            "name" : "06_Validate Many Filter Same time--"
          } ]
        }, {
          "id" : 1570,
          "name" : "02_Validate Filter Activity",
          "steps" : [ {
            "id" : 7022,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 7023,
            "name" : "02_Validate Filter By Departments"
          }, {
            "id" : 7024,
            "name" : "03_Validate Filter by Business"
          }, {
            "id" : 7025,
            "name" : "04_Validate Filter by Brand"
          }, {
            "id" : 7026,
            "name" : "05_Validate Filter by Unit Price"
          }, {
            "id" : 7027,
            "name" : "06_Validate Many Filter Same time"
          } ]
        }, {
          "id" : 1571,
          "name" : "02_Validate Filter ActivityOLD",
          "steps" : [ {
            "id" : 7028,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 7029,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 7030,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 7031,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 7032,
            "name" : "05_Validate Many Filters Same time"
          } ]
        } ]
      }, {
        "id" : 839,
        "name" : "06_Validate Short",
        "scenarios" : [ {
          "id" : 1572,
          "name" : "01_Validate Short Department",
          "steps" : [ {
            "id" : 7033,
            "name" : "01_Validate Price per case Low to High"
          }, {
            "id" : 7034,
            "name" : "02_Validate Price per case High to Low"
          }, {
            "id" : 7035,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 7036,
            "name" : "04_Validate Name Z to A"
          }, {
            "id" : 7037,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 7038,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        }, {
          "id" : 1598,
          "name" : "Validate Short Activity",
          "steps" : [ {
            "id" : 7133,
            "name" : "01_Validate Price per case Low to High"
          }, {
            "id" : 7134,
            "name" : "02_Validate Price per case High to Low"
          }, {
            "id" : 7135,
            "name" : "03_Validate Name A to Z"
          }, {
            "id" : 7136,
            "name" : "04_Validate Name Z to A"
          }, {
            "id" : 7137,
            "name" : "05_Validate Unit Price Low to High"
          }, {
            "id" : 7138,
            "name" : "06_Validate Unit Price High to Low"
          } ]
        } ]
      }, {
        "id" : 840,
        "name" : "07_Validate Article Page Content",
        "scenarios" : [ {
          "id" : 1574,
          "name" : "01_Validate Department Article Page",
          "steps" : [ {
            "id" : 7045,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 7046,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 7189,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 7048,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 7049,
            "name" : "05_Validate Article title"
          }, {
            "id" : 7050,
            "name" : "06_Validate You may also like"
          } ]
        }, {
          "id" : 1608,
          "name" : "02_Validate Activity Article Page.",
          "steps" : [ {
            "id" : 7194,
            "name" : "01_Validate Content article Page"
          }, {
            "id" : 7195,
            "name" : "02_Validate Images article Page"
          }, {
            "id" : 7196,
            "name" : "03_Validate Add Favorite in article page"
          }, {
            "id" : 7197,
            "name" : "04_Validate More About this Product"
          }, {
            "id" : 7198,
            "name" : "05_Validate Article title"
          }, {
            "id" : 7199,
            "name" : "06_Validate You may also like"
          } ]
        } ]
      }, {
        "id" : 841,
        "name" : "08_Close Browser UnMap And Delete Directories",
        "scenarios" : [ {
          "id" : 1576,
          "name" : "01_UnMap And Delete Directory",
          "steps" : [ {
            "id" : 7058,
            "name" : "01_Log To UnMap"
          }, {
            "id" : 7059,
            "name" : "02_Un Map and Delete The Directory On Server And Virtual Machine"
          } ]
        }, {
          "id" : 1577,
          "name" : "02_Close browser",
          "steps" : [ {
            "id" : 7060,
            "name" : "01_Logging of the Teardown"
          }, {
            "id" : 7061,
            "name" : "02_Close Application Mobile"
          } ]
        } ]
      }, {
        "id" : 842,
        "name" : "Copie de 05_Validate Filter",
        "scenarios" : [ {
          "id" : 1578,
          "name" : "01_Validate Filter Department",
          "steps" : [ {
            "id" : 7062,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 7063,
            "name" : "02_Validate Filter By Departments"
          }, {
            "id" : 7064,
            "name" : "03_Validate Filter by Business"
          }, {
            "id" : 7065,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 7066,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 7067,
            "name" : "05_Validate Many Filter Same time"
          } ]
        }, {
          "id" : 1579,
          "name" : "02_Validate Filter Activity",
          "steps" : [ {
            "id" : 7068,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 7069,
            "name" : "02_Validate Filter By Departments"
          }, {
            "id" : 7070,
            "name" : "03_Validate Filter by Business"
          }, {
            "id" : 7071,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 7072,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 7073,
            "name" : "05_Validate Many Filter Same time"
          } ]
        }, {
          "id" : 1580,
          "name" : "02_Validate Filter ActivityOLD",
          "steps" : [ {
            "id" : 7074,
            "name" : "01_Validate See More And Less"
          }, {
            "id" : 7075,
            "name" : "02_Validate Filter By Categories"
          }, {
            "id" : 7076,
            "name" : "03_Validate Filter by Brand"
          }, {
            "id" : 7077,
            "name" : "04_Validate Filter by Unit Price"
          }, {
            "id" : 7078,
            "name" : "05_Validate Many Filters Same time"
          } ]
        } ]
      } ]
    }, {
      "id" : 137,
      "name" : "02_DWS (Desktop My Account IE EN) (Final)",
      "functionalities" : [ {
        "id" : 830,
        "name" : "Setting of Selenium, Browser and Variables",
        "scenarios" : [ {
          "id" : 1551,
          "name" : "Setting Variables (Data Repository)",
          "steps" : [ {
            "id" : 6935,
            "name" : "Setting Variables (Data Repository)"
          }, {
            "id" : 6936,
            "name" : "Log Setting Variables (Data Repository)"
          } ]
        }, {
          "id" : 1552,
          "name" : "Setting Selenium Speed, Timeout and Implicit Wait",
          "steps" : [ {
            "id" : 6937,
            "name" : "Setting Selenium Speed, Timeout and Implicit Wait"
          }, {
            "id" : 6938,
            "name" : "Log Of Setting Selenium Speed, Timeout and Implicit Wait"
          } ]
        }, {
          "id" : 1553,
          "name" : "Setting The Opening Of Browser With Selenium Hub",
          "steps" : [ {
            "id" : 6939,
            "name" : "Setting The Opening Of Browser With Selenium Hub"
          } ]
        } ]
      }, {
        "id" : 831,
        "name" : "Set Language English",
        "scenarios" : [ {
          "id" : 1554,
          "name" : "Set Language English",
          "steps" : [ {
            "id" : 6940,
            "name" : "Set Language English"
          } ]
        } ]
      }, {
        "id" : 832,
        "name" : "Validate My Account",
        "scenarios" : [ {
          "id" : 1555,
          "name" : "Validate Login Functions",
          "steps" : [ {
            "id" : 6941,
            "name" : "Validate Login Logout"
          }, {
            "id" : 6942,
            "name" : "Validate Login Forgot Password"
          } ]
        }, {
          "id" : 1556,
          "name" : "Validate User",
          "steps" : [ {
            "id" : 6943,
            "name" : "Validate User Creation"
          }, {
            "id" : 6944,
            "name" : "Validate User Address Creation"
          } ]
        }, {
          "id" : 1557,
          "name" : "Validate Page Account",
          "steps" : [ {
            "id" : 6945,
            "name" : "Validate Create Blank Account"
          }, {
            "id" : 6946,
            "name" : "Validate Create Account With Invalid Data"
          }, {
            "id" : 6947,
            "name" : "Validate User Register Account Invalid Password"
          }, {
            "id" : 6948,
            "name" : "Validate User Register Account Different Password"
          }, {
            "id" : 6949,
            "name" : "Validate Logged User Shopping Cart Remember"
          }, {
            "id" : 6950,
            "name" : "Validate Modify Account And information English"
          }, {
            "id" : 6951,
            "name" : "Validate Modify Account And information French"
          }, {
            "id" : 6952,
            "name" : "Validate information into Login page"
          }, {
            "id" : 6953,
            "name" : "Validate Stay in checkbox"
          }, {
            "id" : 6954,
            "name" : "Validate Forgot password xxx(Inclu dans Validate Login Functions) xxx"
          }, {
            "id" : 6955,
            "name" : "Copy of Validate Modify Account And information French"
          }, {
            "id" : 6956,
            "name" : "Validate Modify Account And information EnglishOld"
          } ]
        } ]
      }, {
        "id" : 833,
        "name" : "Close Browser",
        "scenarios" : [ {
          "id" : 1558,
          "name" : "Close Browser",
          "steps" : [ {
            "id" : 6957,
            "name" : "Log Of Closing Browser"
          }, {
            "id" : 6958,
            "name" : "Close Browser"
          } ]
        } ]
      } ]
    } ]
  } ];
}
